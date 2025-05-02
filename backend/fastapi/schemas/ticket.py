# backend/fastapi/schemas/ticket.py
# Define Pydantic schemas for tickets here (e.g., TicketCreate, TicketRead)

from pydantic import BaseModel
from typing import Optional

class TicketCreate(BaseModel):
    title: str
    description: str
    reporter_uid: str
    selected_department: Optional[str] = None

class TicketRead(TicketCreate):
    id: int
    status: str
    priority: str
    assigned_department_id: int

    class Config:
        orm_mode = True
