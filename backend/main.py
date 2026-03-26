import zipfile, json, io, os, openpyxl
import pandas as pd
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db, engine
import models

# --- INITIALIZE SYSTEM ---
app = FastAPI()

# Auto-create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

# Enable Cross-Origin Resource Sharing for React
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True, 
    allow_methods=["*"], 
    allow_headers=["*"]
)

LOG_FILE = "user_logs.xlsx"

# --- SYSTEM LOGGING ENGINE ---
def log_to_excel(user, action):
    try:
        ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        if not os.path.exists(LOG_FILE):
            pd.DataFrame(columns=["Timestamp", "User", "Action"]).to_excel(LOG_FILE, index=False)
        wb = openpyxl.load_workbook(LOG_FILE)
        ws = wb.active
        ws.append([ts, user, action])
        wb.save(LOG_FILE)
    except Exception as e:
        print(f"CRITICAL_LOG_ERROR: {e}")

# --- AUTHENTICATION ROUTES ---

@app.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    # Check if Auditor ID exists
    existing = db.query(models.User).filter(models.User.username == data['username']).first()
    if existing:
        raise HTTPException(status_code=400, detail="AUDITOR_ID_CONFLICT")
    
    try:
        # Create user with Email Support
        new_user = models.User(
            username=data['username'], 
            email=data.get('email'), 
            password=data['password']
        )
        db.add(new_user)
        db.commit()
        log_to_excel(data['username'], "NODE_INITIALIZED")
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        print(f"DB_ERROR: {e}")
        raise HTTPException(status_code=500, detail="DATABASE_WRITE_FAILURE")

@app.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.username == data['username'], 
        models.User.password == data['password']
    ).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="ACCESS_DENIED_INVALID_CREDENTIALS")
    
    log_to_excel(user.username, "TERMINAL_LINK_ESTABLISHED")
    return {"status": "success", "username": user.username}

# --- HEURISTIC ANALYSIS ENGINE ---

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        with zipfile.ZipFile(io.BytesIO(contents)) as z:
            manifest_content = z.read("manifest.json")
            manifest = json.loads(manifest_content)
        
        name = manifest.get("name", "Unknown_Package")
        perms = manifest.get("permissions", [])
        
        # Risk Weighting Matrix
        weights = {
            "cookies": 1.0, 
            "<all_urls>": 1.2, 
            "history": 0.8, 
            "tabs": 0.5, 
            "storage": 0.3,
            "management": 0.9,
            "notifications": 0.2
        }
        
        detailed_report = []
        aggregate_score = 0
        
        for p in perms:
            risk_weight = weights.get(p, 0.1)
            detailed_report.append({"name": p, "weight": risk_weight})
            aggregate_score += risk_weight
            
        # Save to MySQL
        report_entry = models.Report(
            extension_name=name, 
            risk_score=round(aggregate_score, 2), 
            summary=json.dumps(detailed_report)
        )
        db.add(report_entry)
        db.commit()
        
        return {
            "name": name, 
            "score": report_entry.risk_score, 
            "permissions": detailed_report
        }
    except Exception as e:
        print(f"SCAN_FAILED: {e}")
        raise HTTPException(status_code=400, detail="MANIFEST_DECRYPTION_FAILED")

# --- DATA RETRIEVAL & MANAGEMENT ---

@app.get("/history")
def get_history(db: Session = Depends(get_db)):
    # Returns last 50 audits ordered by newest first
    return db.query(models.Report).order_by(models.Report.id.desc()).limit(50).all()

@app.delete("/admin/wipe")
def wipe_audit_history(db: Session = Depends(get_db)):
    try:
        # Bypassing foreign key constraints for a clean sweep
        db.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
        db.execute(text("TRUNCATE TABLE reports;"))
        db.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
        db.commit()
        log_to_excel("ADMIN", "DATABASE_PURGE_SUCCESSFUL")
        return {"status": "success", "message": "System logs cleared."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))