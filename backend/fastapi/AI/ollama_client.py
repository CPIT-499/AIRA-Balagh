# backend/AI/ollama_client.py
# Functions to interact with the Ollama API

import httpx
import os
from typing import List, Dict, Any, Optional

# Use environment variable with default fallback
OLLAMA_API_BASE = os.getenv("OLLAMA_API_BASE", "http://localhost:11434")

async def list_models():
    """List available models in Ollama"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{OLLAMA_API_BASE}/api/tags")
            print(f"Tags response: {response.status_code}")
            if response.status_code == 200:
                return response.json()
            return {"models": []}
    except Exception as e:
        print(f"Failed to list models: {e}")
        return {"models": []}

async def classify_with_ollama(text: str, departments: Optional[List[str]] = None) -> str:
    """
    Classify text into a department using Ollama model
    
    Args:
        text: The ticket description to classify
        departments: List of department names to classify into
    
    Returns:
        Department name as string
    """
    if not departments:
        departments = ["IT", "HR", "Facilities", "Finance", "Legal"]
    
    # Format the prompt for classification
    prompt = f"""
    Given the following support ticket message, classify it into exactly one of these departments: {', '.join(departments)}
    
    Message: {text}
    
    Respond with only the department name, no additional text.
    """
    
    # Get available models
    models_info = await list_models()
    models = [m.get("name", "") for m in models_info.get("models", [])]
    print(f"Available models: {models}")
    
    if not models:
        print("No models available. Using default department.")
        return "IT"  # Default
    
    # Use llama3.2 model
    model_name = "llama3.2:latest"
    print(f"Using model: {model_name}")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            # Use /api/chat endpoint instead of /api/generate
            response = await client.post(
                f"{OLLAMA_API_BASE}/api/chat",
                json={
                    "model": model_name,
                    "messages": [
                        {"role": "system", "content": "You are a classifier that responds with only a department name."},
                        {"role": "user", "content": prompt}
                    ],
                    "stream": False,
                    "temperature": 0.1
                }
            )
            
            print(f"Response status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Raw response: {result}")
                
                # Extract department from response - the format is different with /api/chat
                department = result.get("message", {}).get("content", "").strip()
                
                # Basic validation to ensure it's in our list
                if department in departments:
                    return department
                else:
                    # Try to find closest match
                    for dept in departments:
                        if dept.lower() in department.lower():
                            return dept
                    # Default fallback
                    return "IT"  # Default department
            else:
                print(f"API error: {response.status_code} - {response.text}")
                return "IT"
                
        except Exception as e:
            print(f"Error classifying with Ollama: {e}")
            return "IT"  # Default department on error
