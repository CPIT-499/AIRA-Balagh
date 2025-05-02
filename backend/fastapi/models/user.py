# backend/fastapi/models/user.py
from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"

    firebase_uid = Column(String(128), primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    display_name = Column(String(100), nullable=True)
    role = Column(String(50), default='user')
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    # Relationships (optional but helpful)
    reported_tickets = relationship("Ticket", foreign_keys='[Ticket.reporter_uid]', back_populates="reporter")
    assigned_tickets = relationship("Ticket", foreign_keys='[Ticket.assigned_agent_uid]', back_populates="assigned_agent")
