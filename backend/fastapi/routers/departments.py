from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
# Import your department model and schema if you have them
# from models import department as department_model
# from schemas import department as department_schema

router = APIRouter()

@router.get("/")
async def find_department_name(department_ID ,db: Session = Depends(get_db)):
    """
    Retrieve all departments.
    """
    
    find_department_name = db.query(Department).filter(department_ID).all()
    return example_departments

