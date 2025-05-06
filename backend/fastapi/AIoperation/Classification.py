from pydantic import BaseModel
import asyncio
import os
import time
from typing import Dict

# LangChain imports
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.llms import Ollama
from langchain.callbacks.manager import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler


class ClassificationResult(BaseModel):
    category: str
    confidence: float


async def call_with_langchain(message: str, departments: dict) -> str:
    """
    Use LangChain to classify the message into a department
    """
    try:
        # Create prompt template
        template = """
        You are a department classifier.
        
        This is the user message: {message}
        
        Find the department that should handle this request. 
        These are the departments: {departments}
        Respond with ONLY the department name, nothing else.
        """
        
        prompt = ChatPromptTemplate.from_template(template)
        
        # Connect to Ollama - using the environment variable or default to localhost
        ollama_base_url = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")
        
        # Initialize the Ollama model
        llm = Ollama(
            model="llama3.2:latest",
            base_url=ollama_base_url,
            temperature=0.1
        )
        
        # Format the prompt with variables
        formatted_prompt = prompt.format(
            message=message,
            departments=", ".join(departments.keys())
        )
        
        # Run the inference
        result = llm.invoke(formatted_prompt)
        print(f"Result: {result}")
        
        if result in departments.keys():
            return result
        else:
            # If no valid department is found, return "Error"
            return "Error"
        
    except Exception as e:
        print(f"Error with LangChain classification: {type(e).__name__} - {str(e)}")
        return "Error"  # Default response on error


async def Classification(ticket) -> ClassificationResult:
    departments = {
        "HR": "this department handles human resources",
        "IT": "this department handles information technology",
        "Finance": "this department handles financial matters",
        "Marketing": "this department handles marketing and advertising"
    }
    
    # Call LangChain instead of direct API call
    result_string = await call_with_langchain(ticket.massage, departments)
    
    # Process the result - find the closest department match if needed
    if result_string != "Error":
        for dept in departments.keys():
            if dept.lower() in result_string.lower():
                result_string = dept
                break
    
    # Create a ClassificationResult object.  For now, confidence is 1.0
    result = ClassificationResult(category=result_string, confidence=1.0)
    return result