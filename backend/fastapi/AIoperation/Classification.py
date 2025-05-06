from pydantic import BaseModel
from retrieve import getdepartment
class ClassificationResult(BaseModel):
    category: str
    confidence: float

def Classification(ticket: str) -> ClassificationResult:
    getdepartment(ticket.organization_id)