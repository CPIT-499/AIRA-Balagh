from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Organization

def extract_organization_from_email(email: str, db: Session):
    """
    Extract organization ID from email domain.
    Example: john@acme.com would look for an organization named "acme"
    """
    if not email or '@' not in email:
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Extract the domain part (after @)
    domain = email.split('@')[1]
    
    # Extract organization name from domain (before the first dot)
    org_name = domain.split('.')[0]
    
    # Query the database for the organization
    organization = db.query(Organization).filter(Organization.name.ilike(f"%{org_name}%")).first()
    
    if not organization:
        # If no organization found, return the default organization or raise an error
        # For now, let's raise an error
        raise HTTPException(status_code=404, detail=f"No organization found for {org_name}")
    
    return organization.id