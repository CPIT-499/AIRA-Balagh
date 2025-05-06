from fastapi import FastAPI, Depends, HTTPException, Query, Header
from fastapi.middleware.cors import CORSMiddleware  # Add this import
from sqlalchemy.orm import Session
from pydantic import BaseModel
from firebase_admin import auth
from AIoperation.Classification import Classification
from database import get_db
from routers import tickets, organizations  # Import the tickets and organizations routers
from schemas.ticket import TicketCreate, TicketRead
from sqlalchemy import text
from util import extract_organization_id_from_email

app = FastAPI(
    title="AIRA API",
    description="AI Routing Assistant API",
    version="1.0.0",
)

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",  # Vite dev server default port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
app.include_router(organizations.router, prefix="/organizations", tags=["organizations"])  # Include the organizations router

@app.get("/")
def health_check(db: Session = Depends(get_db)):
    return {"status": "ok :)"}

class TicketFormatRequest(BaseModel):
    massage: str

class TicketFormatInformation(BaseModel):
    massage: str
    username: str
    email: str
    title: str

@app.post("/send-ticket", response_model=TicketRead)
async def create_item(
    title: str = Query(..., description="Short title describing the issue"),
    massage: str = Query(..., description="Detailed description of the issue"), 
    username: str = Query(..., description="Your name"), 
    email: str = Query(..., description="Your email address"),
    db: Session = Depends(get_db)
):
    print(f"New ticket: {title} - {username}")
    ticket_data = TicketFormatRequest(massage=massage)
    deptName = await Classification(ticket_data)
    information = TicketFormatInformation(
        username=username, 
        email=email, 
        massage=massage, 
        title=title
    )
    
    # Create a TicketCreate object
    ticket_create = TicketCreate(
        title=information.title,
        description=information.massage,
        deptName=deptName,
    )
    
    # Call the create_ticket function from the tickets router
    try:
        new_ticket = await tickets.create_ticket(ticket_create, db)
        return new_ticket
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test-db")
def test_db(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))  
        return {"message": "Database connection successful"}
    except Exception as e:
        return {"error": str(e)}

async def verify_token(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Invalid auth scheme")
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

