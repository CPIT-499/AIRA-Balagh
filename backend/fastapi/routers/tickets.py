from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import ticket as ticket_model, department as department_model, user as user_model
from schemas import ticket as ticket_schema
from AIoperation.Classification import Classification

router = APIRouter()

@router.post("/", response_model=ticket_schema.TicketRead)
async def create_ticket(ticket: ticket_schema.TicketCreate, db: Session = Depends(get_db)):
    """
    Create a new ticket.
    """
    try:
        
        dept_name = ticket.selected_department  # Assuming selected_department is the department name
        dept = db.query(department_model.Department).filter(
            department_model.Department.name == dept_name,
            department_model.Department.organization_id == organization_id
        ).first()
        if not dept:
            raise HTTPException(status_code=404, detail="Department not found")

        # 4. Create and save ticket
        db_ticket = ticket_model.Ticket(
            title=ticket.title,
            description=ticket.description,
            reporter_uid=ticket.reporter_uid,
            assigned_department_id=dept.id,  # Use the correct department ID
            organization_id=organization_id
        )
        db.add(db_ticket)
        db.commit()
        db.refresh(db_ticket)
        return db_ticket
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{ticket_id}", response_model=ticket_schema.TicketRead)
def read_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """
    Get a ticket by ID.
    """
    db_ticket = db.query(ticket_model.Ticket).filter(ticket_model.Ticket.id == ticket_id).first()
    if db_ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return db_ticket