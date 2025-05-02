from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models.ticket import Ticket
from ..models.department import Department
from ..schemas.ticket import TicketCreate, TicketRead
from ..AI.ollama_client import classify_with_ollama

router = APIRouter()

@router.post("/", response_model=TicketRead)
async def create_ticket(
    payload: TicketCreate,
    db: Session = Depends(get_db)
):
    # 1) Determine department: either from client or via AI
    if payload.selected_department:
        dept = db.query(Department)\
                 .filter(Department.name == payload.selected_department)\
                 .first()
    else:
        dept_name = await classify_with_ollama(payload.description)
        dept = db.query(Department)\
                 .filter(Department.name == dept_name)\
                 .first()

    if not dept:
        raise HTTPException(400, detail="Department not found")

    # 2) Create and save ticket
    ticket = Ticket(
        title=payload.title,
        description=payload.description,
        reporter_uid=payload.reporter_uid,
        assigned_department_id=dept.id
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket