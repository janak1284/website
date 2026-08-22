import random
import string
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from database import get_db
from models import User, Team
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/teams", tags=["teams"])

class CreateTeamRequest(BaseModel):
    name: str

class AddMemberRequest(BaseModel):
    email: str

def generate_join_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@router.post("/create")
async def create_team(req: CreateTeamRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user.team_id is not None:
        raise HTTPException(status_code=400, detail="You are already part of a team.")
        
    join_code = generate_join_code()
    
    new_team = Team(name=req.name, join_code=join_code, leader_id=user.id)
    db.add(new_team)
    await db.commit()
    await db.refresh(new_team)
    
    user.team_id = new_team.id
    await db.commit()
    
    return {"message": "Team created successfully", "team_id": new_team.id, "join_code": join_code}

@router.get("/me")
async def get_my_team(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not user.team_id:
        raise HTTPException(status_code=404, detail="User is not in a team")
        
    result = await db.execute(
        select(Team)
        .options(selectinload(Team.members), selectinload(Team.problem_statement))
        .where(Team.id == user.team_id)
    )
    team = result.scalars().first()
    if not team:
         raise HTTPException(status_code=404, detail="Team not found")
         
    return team

@router.post("/add-member")
async def add_member(req: AddMemberRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not user.team_id:
         raise HTTPException(status_code=400, detail="User is not in a team")
         
    result = await db.execute(
        select(Team).options(selectinload(Team.members)).where(Team.id == user.team_id)
    )
    team = result.scalars().first()
    
    if team.leader_id != user.id:
         raise HTTPException(status_code=403, detail="Only the team leader can add members.")
         
    if len(team.members) >= 4:
         raise HTTPException(status_code=400, detail="Team capacity reached (Max 4).")
         
    # Check if member exists
    member_result = await db.execute(select(User).where(User.email == req.email))
    member = member_result.scalars().first()
    
    if not member:
         raise HTTPException(status_code=404, detail="User not found. They must log in to the portal first.")
         
    if member.team_id:
         raise HTTPException(status_code=400, detail="This user is already part of a team.")
         
    member.team_id = team.id
    await db.commit()
    
    return {"message": "Member added successfully"}
