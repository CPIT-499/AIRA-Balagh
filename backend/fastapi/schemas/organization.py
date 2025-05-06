from pydantic import BaseModel
from typing import Optional

class OrganizationBase(BaseModel):
    name: str
    description: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(OrganizationBase):
    name: Optional[str] = None

class OrganizationRead(OrganizationBase):
    id: int

    class Config:
        orm_mode = True