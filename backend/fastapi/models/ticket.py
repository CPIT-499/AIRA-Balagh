# backend/fastapi/models/ticket.py

from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base  # Changed to absolute import

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default='open', index=True)
    priority = Column(String(50), default='medium')
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
    resolved_at = Column(TIMESTAMP(timezone=True), nullable=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)

    assigned_department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    assigned_agent_uid = Column(String(128), ForeignKey("users.firebase_uid", ondelete="SET NULL"), nullable=True)

    email = Column(String(255), nullable=False)
    # Relationships
    assigned_department = relationship("Department", back_populates="tickets")
    assigned_agent = relationship("User", foreign_keys=[assigned_agent_uid], back_populates="assigned_tickets")