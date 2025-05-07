# backend/fastapi/schemas/department.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DepartmentBase(BaseModel):
    name: str
    description: Optional[str] = None
    organization_id: int

class DepartmentCreate(DepartmentBase):
    pass

class Department(DepartmentBase): # For reading, includes ID and created_at
    id: int
    name: str
    created_at: datetime

    class Config:
        from_attributes = True # Changed from orm_mode

# If you need a schema for reading that might include related objects (e.g., tickets or organization details)
# you can define it separately, for example:
# class DepartmentReadWithDetails(Department):
#     # tickets: list[Ticket] = []  # Assuming Ticket schema is defined elsewhere
#     # organization: Organization  # Assuming Organization schema is defined elsewhere
#     pass
