from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
import os
import uuid

from database import get_db
from models import Team, ProblemStatement

router = APIRouter(prefix="/api/admin", tags=["admin"])

ADMIN_SECRET_KEY = os.getenv("ADMIN_SECRET_KEY", "super_secret_admin_override")

class ForceAssignRequest(BaseModel):
    team_join_code: str
    ps_id: str

class UnassignRequest(BaseModel):
    team_join_code: str

async def verify_admin_key(x_admin_key: str = Header(...)):
    if x_admin_key != ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin key")
    return x_admin_key

@router.post("/force-assign-ps")
async def force_assign_ps(
    req: ForceAssignRequest, 
    admin_key: str = Depends(verify_admin_key),
    db: AsyncSession = Depends(get_db)
):
    async with db.begin():
        # Fetch team
        team_result = await db.execute(select(Team).where(Team.join_code == req.team_join_code))
        team = team_result.scalars().first()
        
        if not team:
            raise HTTPException(status_code=404, detail="Team not found with the given join code")
            
        # Fetch PS
        try:
            target_uuid = uuid.UUID(req.ps_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid PS ID format")
            
        ps_result = await db.execute(select(ProblemStatement).where(ProblemStatement.id == target_uuid))
        ps = ps_result.scalars().first()
        
        if not ps:
            raise HTTPException(status_code=404, detail="Problem statement not found")
            
        # Bypass all time and quota checks, just assign
        team.ps_id = ps.id
        db.add(team)
        
    return {"message": f"Successfully forced team {team.name} to problem statement {ps.title}"}

@router.post("/unassign-ps")
async def unassign_ps(
    req: UnassignRequest, 
    admin_key: str = Depends(verify_admin_key),
    db: AsyncSession = Depends(get_db)
):
    async with db.begin():
        # Fetch team
        team_result = await db.execute(select(Team).where(Team.join_code == req.team_join_code))
        team = team_result.scalars().first()
        
        if not team:
            raise HTTPException(status_code=404, detail="Team not found with the given join code")
            
        if team.ps_id is None:
            return {"message": "Team does not currently have a locked problem statement."}
            
        # Unassign
        team.ps_id = None
        db.add(team)
        
    return {"message": f"Successfully unassigned problem statement from team {team.name}"}
