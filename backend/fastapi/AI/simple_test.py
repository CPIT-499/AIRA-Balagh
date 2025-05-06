import asyncio
import httpx

async def test_ollama_api():
    print("Testing Ollama API...")
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:  # Increased timeout
            # Test version
            response = await client.get("http://localhost:11434/api/version")
            print(f"API Version: {response.json()}")
            
            # Test models
            response = await client.get("http://localhost:11434/api/tags")
            print(f"Models: {response.json()}")
            
            print("\nTesting chat API with llama3.2 model...")
            print("Sending request...")
            
            # Test chat API
            try:
                data = {
                    "model": "llama3.2:latest",
                    "messages": [
                        {"role": "user", "content": "Hello, how are you?"},
                    ],
                    "stream": False
                }
                
                response = await client.post("http://localhost:11434/api/chat", json=data, timeout=60.0)
                print(f"Chat API Status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"Response: {result}")
                else:
                    print(f"Error response: {response.text}")
                    
            except httpx.TimeoutException:
                print("Request timed out - the model might be loading or processing")
            except Exception as e:
                print(f"Chat API request failed: {type(e).__name__}: {str(e)}")
            
    except Exception as e:
        print(f"General error: {type(e).__name__}: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_ollama_api())