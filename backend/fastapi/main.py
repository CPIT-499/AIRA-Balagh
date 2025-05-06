from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from fastapi import Header, HTTPException, Depends
from firebase_admin import auth
from AIoperation import Classification

from database import get_db

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

@app.get("/")
def health_check(db: Session = Depends(get_db)):
    return {"status": "ok :)"}








class TicketFormatRequest(BaseModel):
    massage: str

# async def create_item(ticket: Item, organization=Depends(verify_token)):



@app.post("/send-ticket/")
async def create_item(ticket: TicketFormatRequest):
    #organization_id = organization["oid"]
    organization_id = 1
    result = Classification(ticket)

    return result







async def verify_token(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Invalid auth scheme")
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

