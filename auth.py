import os
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from google.oauth2 import id_token
from google.auth.transport import requests
from pydantic import BaseModel
from datetime import datetime, timedelta

from database import get_db
from models import User

router = APIRouter(prefix="/api/auth", tags=["auth"])
security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

class GoogleToken(BaseModel):
    token: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

    result = await db.execute(
        select(User)
        .options(selectinload(User.team), selectinload(User.led_team))
        .where(User.id == user_id)
    )
    user = result.scalars().first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.post("/google")
async def google_auth(google_token: GoogleToken, db: AsyncSession = Depends(get_db)):
    if not JWT_SECRET or not GOOGLE_CLIENT_ID:
         raise HTTPException(status_code=500, detail="Server configuration error")
         
    try:
        idinfo = id_token.verify_oauth2_token(google_token.token, requests.Request(), GOOGLE_CLIENT_ID)
        
        email = idinfo.get("email")
        name = idinfo.get("name")
        avatar_url = idinfo.get("picture")
        
        if not email:
            raise ValueError("Email not found in token")

        # Upsert user
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        
        if user:
            user.name = name
            user.avatar_url = avatar_url
        else:
            user = User(email=email, name=name, avatar_url=avatar_url)
            db.add(user)
            
        await db.commit()
        await db.refresh(user)
        
        access_token = create_access_token(data={"user_id": str(user.id), "email": user.email})
        return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "name": user.name}}

    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
