import re
from fastapi import FastAPI, Depends, HTTPException, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth
from AIoperation.Classification import Classification
from database import get_db
from routers import tickets, organizations
from schemas.ticket import TicketCreate, TicketRead
from sqlalchemy import text
from config.config import get_firebase_user_from_token
from utilities import extract_organization_from_email
from schemas.department import Department
from models import Ticket, Department  # Make sure to import your ORM models

# —––––––– Firebase initialization –––––––—
cred = credentials.Certificate("config/firebase.json") # This path is relative to main.py
firebase_admin.initialize_app(cred)

class TicketFormatRequest(BaseModel):
    massage: str

class TicketFormatInformation(BaseModel):
    username: str
    email: str
    massage: str
    title: str

app = FastAPI(
    title="AIRA API",
    description="AI Routing Assistant API",
    version="1.0.0",
)


origins = [
    "http://localhost:3000",
    "http://localhost",
    "http://localhost:8000",
    "https://localhost:3000",
    "https://localhost",
    "https://localhost:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    tickets.router,
    prefix="/tickets",
    tags=["tickets"]
)
app.include_router(organizations.router, prefix="/organizations", tags=["organizations"])

@app.get("/")
def health_check(db: Session = Depends(get_db)):
    return {"status": "ok :)"}

@app.get("/test")
async def test_db(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1")).scalar()
    return {"result": result}


@app.get("/test-auth")
async def test_auth_and_print_user(
    user: dict = Depends(get_firebase_user_from_token), # Correct
    db: Session = Depends(get_db),
):
    ticket_id: int = Query(..., description="Ticket ID to retrieve")


@app.get("/tickets")
async def get_tickets(db: Session = Depends(get_db)):
    organization_id = extract_organization_from_email("demo@demo.com", db)
    tickets = db.query(Ticket).filter(
        Ticket.organization_id == organization_id
    ).all()
    print(tickets)
    return tickets


@app.get("/departments")
async def get_department(db: Session = Depends(get_db)):
    organization_id = extract_organization_from_email("demo@demo.com", db)
    departments = db.query(Department).filter(Department.organization_id == organization_id).all()
    print(departments)
    return departments


@app.post("/send-ticket", response_model=TicketRead)
async def create_item(
    title: str = Query(..., description="Short title describing the issue"),
    massage: str = Query(..., description="Detailed description of the issue"),
    name: str = Query(..., description="Your name"),
    email: str = Query(..., description="Your email address"),
    db: Session = Depends(get_db)
):
    ticket_data = TicketFormatRequest(massage=massage)

    classification_result = await Classification(ticket_data,email,db)
    deptName = classification_result.category  # Extract the department name

    information = TicketFormatInformation(
        username=name,
        email=email,
        massage=massage,
        title=title
    )

    # Validate email format
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    # Create a TicketCreate object
    ticket_create = TicketCreate(
        title=information.title,
        description=information.massage,
        userEmail=email,  # Pass the validated email
        selected_department=deptName,  # Pass the department name
        username=information.username  # Pass the username
    )
    try:
        new_ticket = await tickets.create_ticket(ticket_create, db)
        return new_ticket
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def verify_token(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Invalid auth scheme")
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

