from pydantic import BaseModel
#from retrieve.DBretrieve import getdepartment
import asyncio
import httpx


class ClassificationResult(BaseModel):
    category: str
    confidence: float

def Classification(ticket: str) -> ClassificationResult:
    #departments = getdepartment(ticket.organization_id)
    departments = {
        "HR": "this department handles human resources",
        "IT": "this department handles information technology",
        "Finance": "this department handles financial matters",
        "Marketing": "this department handles marketing and advertising"
    }
    result = callOllama(ticket.massage, departments)
    return result
    





async def callOllama(departments: list[str], message: str) -> str:
    async with httpx.AsyncClient(timeout=60.0) as client:
        data = {
            "model": "llama3.2:latest",
            "messages": [
                {
                    "role": "user",
                    "content": f"this is the user message: {message}. Find the department that should handle the request. These are the departments: {departments}"
                }
            ],
            "stream": False
        }
        response = await client.post("http://localhost:11434/api/chat", json=data)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error: {response.status_code}, {response.text}")
