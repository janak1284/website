from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from pydantic import BaseModel
import uuid
from datetime import datetime, timezone, timedelta

from database import get_db
from models import User, Team, ProblemStatement
from auth import get_current_user

router = APIRouter(prefix="/api/ps", tags=["problem_statements"])

class ClaimPSRequest(BaseModel):
    ps_id: str

# Time constraints
IST = timezone(timedelta(hours=5, minutes=30))
PS_START_TIME = datetime(2026, 9, 7, 12, 30, 0, tzinfo=IST)
PS_END_TIME = datetime(2026, 9, 7, 13, 0, 0, tzinfo=IST)

@router.get("/")
async def get_problem_statements(db: AsyncSession = Depends(get_db)):
    # Get all active PS
    ps_result = await db.execute(select(ProblemStatement).where(ProblemStatement.is_active == True))
    statements = ps_result.scalars().all()
    
    # Calculate claimed count for each
    counts_result = await db.execute(
        select(Team.ps_id, func.count(Team.id).label('claimed_count'))
        .where(Team.ps_id.isnot(None))
        .group_by(Team.ps_id)
    )
    
    counts_map = {row.ps_id: row.claimed_count for row in counts_result}
    
    response = []
    for ps in statements:
        claimed = counts_map.get(ps.id, 0)
        response.append({
            "id": ps.id,
            "title": ps.title,
            "description": ps.description,
            "track": ps.track,
            "max_quota": ps.max_quota,
            "claimed_count": claimed
        })
        
    return response

@router.post("/claim")
async def claim_problem_statement(req: ClaimPSRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    current_time = datetime.now(IST)
    if current_time < PS_START_TIME or current_time > PS_END_TIME:
        raise HTTPException(
            status_code=403, 
            detail="Problem statement selection is strictly limited to 12:30 PM to 1:00 PM on Sept 7, 2026 (IST)."
        )
        
    if not user.team_id:
        raise HTTPException(status_code=400, detail="User is not in a team")
        
    # Atomic transaction
    async with db.begin():
        # Validate user is leader
        team_result = await db.execute(select(Team).where(Team.id == user.team_id))
        team = team_result.scalars().first()
        
        if team.leader_id != user.id:
             raise HTTPException(status_code=403, detail="Only team leader can claim a problem statement")
             
        if team.ps_id:
             raise HTTPException(status_code=400, detail="Team has already claimed a problem statement")
             
        # Lock target PS row
        try:
            target_uuid = uuid.UUID(req.ps_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid PS ID format")
            
        ps_result = await db.execute(
             select(ProblemStatement).where(ProblemStatement.id == target_uuid).with_for_update()
        )
        ps = ps_result.scalars().first()
        
        if not ps or not ps.is_active:
             raise HTTPException(status_code=404, detail="Problem statement not found or not active")
             
        # Check claims
        claims_result = await db.execute(
             select(func.count(Team.id)).where(Team.ps_id == ps.id)
        )
        current_claims = claims_result.scalar()
        
        if current_claims >= ps.max_quota:
             raise HTTPException(status_code=409, detail="Quota full for this problem statement")
             
        # Assign
        team.ps_id = ps.id
        db.add(team)
    
    return {"message": "Problem statement claimed successfully"}
