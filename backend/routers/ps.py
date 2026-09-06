from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, cast, String
from pydantic import BaseModel
import uuid
from datetime import datetime
from zoneinfo import ZoneInfo

from database import get_db
from models import User, Team, ProblemStatement
from auth import get_current_user

router = APIRouter(prefix="/api/ps", tags=["problem_statements"])

class ClaimPSRequest(BaseModel):
    ps_id: str

# Time constraints
IST = ZoneInfo("Asia/Kolkata")

@router.get("")
async def get_problem_statements(track: str | None = None, db: AsyncSession = Depends(get_db)):
    # Get all active PS
    query = select(ProblemStatement).where(ProblemStatement.is_active == True)
    if track:
        query = query.where(func.lower(cast(ProblemStatement.track, String)) == track.lower())
    ps_result = await db.execute(query)
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
    if not user.team_id:
        raise HTTPException(status_code=400, detail="User is not in a team")
        
    # Atomic transaction
    try:
        # Validate user is leader
        team_result = await db.execute(select(Team).where(Team.id == user.team_id))
        team = team_result.scalars().first()
        
        if team.leader_id != user.id:
             raise HTTPException(status_code=403, detail="Only the team leader can claim a problem statement.")
             
        if not team.selected_track:
             raise HTTPException(status_code=403, detail="Your team must lock in a track before claiming a problem statement.")
             
        # Time Window Validation
        current_time = datetime.now(IST)
        if team.selected_track == "hardware":
            hardware_end_time = datetime(2026, 9, 6, 22, 0, 0, tzinfo=IST)
            if current_time >= hardware_end_time:
                raise HTTPException(status_code=403, detail=f"The selection window for the {team.selected_track} track is currently closed.")
        elif team.selected_track == "software":
            software_start = datetime(2026, 9, 7, 12, 30, 0, tzinfo=IST)
            software_end = datetime(2026, 9, 7, 13, 0, 0, tzinfo=IST)
            if current_time < software_start or current_time > software_end:
                raise HTTPException(status_code=403, detail=f"The selection window for the {team.selected_track} track is currently closed.")
                
        if team.ps_id:
             raise HTTPException(status_code=400, detail="Your team has already claimed a problem statement.")
             
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
             
        if ps.track != team.selected_track:
             raise HTTPException(status_code=403, detail="This problem statement does not belong to your team's locked-in track.")
             
        # Check claims
        claims_result = await db.execute(
             select(func.count(Team.id)).where(Team.ps_id == ps.id)
        )
        current_claims = claims_result.scalar()
        
        if current_claims >= ps.max_quota:
             raise HTTPException(status_code=409, detail="Quota full for this problem statement.")
             
        # Assign
        team.ps_id = ps.id
        db.add(team)
        await db.commit()
    except HTTPException:
        await db.rollback()
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error")
    
    return {"message": "Problem statement claimed successfully"}
