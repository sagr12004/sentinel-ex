from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse  # This is the important new part

# This safely handles the '@' in your password
password = urllib.parse.quote_plus("Sagar@2004")
URL = f"mysql+mysqlconnector://root:{password}@localhost/extension_guard"

engine = create_engine(URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()