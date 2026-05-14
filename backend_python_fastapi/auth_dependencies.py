from fastapi import HTTPException, Header
from jose import jwt, JWTError
from config import Config

def verify_token(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    try:
        # Remove "Bearer " prefix
        token = authorization.replace("Bearer ", "")

        # Decode and verify token using shared secret
        payload = jwt.decode(
            token,
            Config.JWT_SECRET,
            algorithms=["HS256"]
        )

        email = payload.get("email")
        if not email:
            raise HTTPException(
                status_code=401,
                detail="Invalid token — email not found"
            )

        return payload  # returns full payload including email

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )