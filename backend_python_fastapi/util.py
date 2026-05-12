import logging
import uuid
from datetime import datetime, timedelta

import jwt
from config import Config



def create_access_token(user_data: dict, expiry: timedelta = None, refresh: bool = False):
    payload = {}

    payload["user"] = user_data

    if expiry is not None:
        expire_time = datetime.now() + expiry
    else:
        expire_time = datetime.now() + timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload["exp"] = int(expire_time.timestamp())
    payload["jti"] = str(uuid.uuid4())
    payload["refresh"] = refresh

    token = jwt.encode(payload=payload, key=Config.JWT_SECRET, algorithm=Config.JWT_ALGORITHM)

    return token


def decode_token(token: str) -> dict:
    try:
        token_data = jwt.decode(jwt=token, key=Config.JWT_SECRET, algorithms=[Config.JWT_ALGORITHM]) 
        return token_data
    except jwt.PyJWTError as e:
        logging.exception(e)
        return None






