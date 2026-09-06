import os
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from datetime import datetime, timedelta

from database import get_db
from models import JudgingStaff

router = APIRouter(prefix="/api/judging", tags=["judging_auth"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for judging (separate from main participant auth)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/judging/login")

JWT_SECRET = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_judging_staff(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    result = await db.execute(select(JudgingStaff).where(JudgingStaff.username == username))
    staff = result.scalars().first()
    
    if staff is None:
        raise credentials_exception
        
    return staff

async def get_judging_admin(staff: JudgingStaff = Depends(get_current_judging_staff)):
    # Assuming role is an enum, we check .value. If it's a string, we check the string.
    staff_role = staff.role.value if hasattr(staff.role, 'value') else staff.role
    if staff_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return staff

@router.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    # Authenticate judging staff
    result = await db.execute(select(JudgingStaff).where(JudgingStaff.username == form_data.username))
    staff = result.scalars().first()
    
    if not staff or not verify_password(form_data.password, staff.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    staff_role = staff.role.value if hasattr(staff.role, 'value') else staff.role
    # Create JWT token
    access_token = create_access_token(
        data={"sub": staff.username, "role": staff_role}
    )
    return {"access_token": access_token, "token_type": "bearer"}
