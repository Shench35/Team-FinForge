from fastapi.security import HTTPBearer
from fastapi import Request, status
from fastapi.security.http import HTTPAuthorizationCredentials
from util import decode_token
from fastapi.exceptions import HTTPException


class TokenBearer(HTTPBearer):

    def __init__(self, auto_error=True):
        super().__init__(auto_error=auto_error)



    def token_valid(self, token:str)-> bool:
        # Token validation is now handled in __call__ method
        # This method is kept for backward compatibility but should be removed
        token_data = decode_token(token)
        return True if token_data is not None else False
    
    def verify_token_data(self, token_data):
        raise NotImplementedError("Please override this method in the child classes")
    

    async def __call__(self, request:Request)->HTTPAuthorizationCredentials|None:
        cred = await super().__call__(request)

        token = cred.credentials

        token_data = decode_token(token)
        
        if token_data is None:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
                "error":"This token is invalid or revoked",
                "resolution":"get a new token"
            })

        
        self.verify_token_data(token_data)
        
        return token_data


class AccessTokenBearer(TokenBearer):

    def verify_token_data(self, token_data:dict)-> None:
        if token_data and token_data["refresh"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="please provide a valid access token")
        
class RefreshTokenBearer(TokenBearer):
    def verify_token_data(self, token_data:dict)-> None:
        if token_data and not token_data["refresh"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="please provide a valid refresh token")

