import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. DATABASE CONNECTION STRING
# Format: mysql+pymysql://user:password@host:port/dbname
# We use os.getenv so the cloud can inject the password securely
DB_URL = os.getenv(
    "DATABASE_URL", 
    "mysql+pymysql://avnadmin:<redacted>@mysql-31d5a92f-sagarssmrvpucollege-69f8.a.aivencloud.com:12005/defaultdb"
)

# 2. CREATE THE ENGINE
engine = create_engine(DB_URL)

# 3. SESSION AND BASE
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 4. DEPENDENCY
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()