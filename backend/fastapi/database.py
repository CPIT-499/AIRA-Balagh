from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database connection string from environment variables
DATABASE_URL="postgresql://AIRA:AIRA%40123@postgres:5432/postgres"

# Create engine with proper pool settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Helps detect disconnections
    pool_recycle=3600,   # Recycle connections after 1 hour
    echo=False           # Set to True for SQL logging during development
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()