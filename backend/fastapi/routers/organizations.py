from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Organization  # Import the class directly, not as a module
from schemas import organization as organization_schema

router = APIRouter()

@router.post("/", response_model=organization_schema.OrganizationRead)
def create_organization(organization: organization_schema.OrganizationCreate, db: Session = Depends(get_db)):
    """
    Create a new organization.
    """
    db_organization = Organization(**organization.dict())
    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)
    return db_organization

@router.get("/{organization_id}", response_model=organization_schema.OrganizationRead)
def read_organization(organization_id: int, db: Session = Depends(get_db)):
    """
    Get an organization by ID.
    """
    db_organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return db_organization

@router.put("/{organization_id}", response_model=organization_schema.OrganizationRead)
def update_organization(organization_id: int, organization: organization_schema.OrganizationUpdate, db: Session = Depends(get_db)):
    """
    Update an organization.
    """
    db_organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")

    for key, value in organization.dict(exclude_unset=True).items():
        setattr(db_organization, key, value)

    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)
    return db_organization

@router.delete("/{organization_id}", response_model=organization_schema.OrganizationRead)
def delete_organization(organization_id: int, db: Session = Depends(get_db)):
    """
    Delete an organization.
    """
    db_organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if db_organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")

    db.delete(db_organization)
    db.commit()
    return db_organization