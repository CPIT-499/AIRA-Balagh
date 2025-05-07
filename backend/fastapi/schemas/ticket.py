# backend/fastapi/schemas/ticket.py
# Define Pydantic schemas for tickets here (e.g., TicketCreate, TicketRead)

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TicketCreate(BaseModel):
    title: str
    description: str
    userEmail: str
    selected_department: Optional[str] = None  # This might already be optional
    username: str
    reporter_uid: Optional[str] = None  # Make optional with default None

class TicketRead(BaseModel):
    id: int
    title: str
    description: str
    status: str
    priority: str
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
    organization_id: int
    reporter_uid: Optional[str] = None
    assigned_department_id: Optional[int] = None
    assigned_agent_uid: Optional[str] = None
    email: str

    class Config:
        orm_mode = True
