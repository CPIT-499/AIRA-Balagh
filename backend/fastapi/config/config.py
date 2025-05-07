import os
import pathlib
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer  # Added HTTPBearer
from firebase_admin.auth import verify_id_token
from firebase_admin import credentials, auth
import firebase_admin
from typing import Annotated  # Added Annotated

CONFIG_DIR = pathlib.Path(__file__).parent.resolve()

# Define the bearer scheme
bearer_scheme = HTTPBearer(auto_error=False)

def get_firebase_user_from_token(
    token: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)]  # Corrected signature
) -> dict | None:
    """Uses bearer token to identify firebase user id
    Args:
        token : the bearer token. Can be None as auto_error is False (from bearer_scheme)
    Returns:
        dict: the firebase user on success
    Raises:
        HTTPException 401 if user does not exist or token is invalid
    """
    try:
        if not firebase_admin._apps:  # Check if Firebase app is initialized
            # This check is good, but initialization should be guaranteed at app startup (main.py)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Firebase Admin SDK not initialized.",
            )

        if not token or not token.credentials:  # Check token and token.credentials
            # auto_error=False in HTTPBearer means token can be None if not provided
            # If it's None, or credentials are not set, treat as unauthenticated.
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated or No token provided",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = verify_id_token(token.credentials)  # This is the key Firebase Admin SDK call
        return user
    # Removed the specific ValueError for "No token" as the check above is more comprehensive
    # with HTTPBearer(auto_error=False)
    except firebase_admin.auth.InvalidIdTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid ID token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except HTTPException as e:  # Re-raise HTTPExceptions directly
        raise e
    except Exception as e:  # Catch other Firebase auth errors or general errors
        # Log the error for server-side review: print(f"Unexpected token verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,  # Generic error for client
            detail="Invalid credentials or unable to verify token",
            headers={"WWW-Authenticate": "Bearer"},
        )