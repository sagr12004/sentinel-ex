from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True)
    email = Column(String(255), nullable=True) # Matches the column you just checked!
    password = Column(String(255))

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    extension_name = Column(String(255))
    risk_score = Column(Float)
    summary = Column(Text) # Stores the JSON permissions data
    created_at = Column(DateTime(timezone=True), server_default=func.now())