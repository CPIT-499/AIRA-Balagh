# backend/fastapi/schemas/ticket.py
# Define Pydantic schemas for tickets here (e.g., TicketCreate, TicketRead)

from pydantic import BaseModel
from typing import Optional

class TicketCreate(BaseModel):
    title: str
    description: str
    reporter_uid: str
    assigned_department_id: Optional[int] = None
    selected_department: str

class TicketRead(BaseModel):
    id: int
    title: str
    description: str
    status: str
    priority: str
    reporter_uid: str
    assigned_department_id: Optional[int]
    organization_id: int  # Add organization_id

    class Config:
        orm_mode = True
