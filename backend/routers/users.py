from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from database import get_db
from models import User
from auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/checkin-token")
async def get_checkin_token(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # The checkin_app schema uses lowercased emails for the mapping
    email_lower = user.email.lower()
    
    # Use raw SQL to query the checkin_app schema directly
    query = text("SELECT token FROM checkin_app.email_token_map WHERE email = :email")
    result = await db.execute(query, {"email": email_lower})
    token = result.scalar()
    
    if not token:
        raise HTTPException(status_code=404, detail="Check-in QR code pending generation.")
        
    return {"token": token}
