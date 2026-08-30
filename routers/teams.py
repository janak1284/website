import random
import string
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from database import get_db
from models import User, Team, FinalSubmission
from auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/api/teams", tags=["teams"])

@router.get("/debug")
async def debug_user(user: User = Depends(get_current_user)):
    return {
        "user_id": str(user.id),
        "team_id": str(user.team_id) if user.team_id else None,
        "has_team": user.team is not None,
        "has_led_team": user.led_team is not None,
        "led_team_id": str(user.led_team.id) if user.led_team else None
    }


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
    await db.flush()
    
    user.team_id = new_team.id
    await db.commit()
    await db.refresh(new_team)
    
    return {
        "id": str(new_team.id),
        "name": new_team.name,
        "join_code": new_team.join_code,
        "leader_id": str(new_team.leader_id)
    }

@router.get("/me")
async def get_my_team(user: User = Depends(get_current_user)):
    team = user.team or user.led_team
    if not team:
        raise HTTPException(status_code=404, detail="You are not in a team yet.")
        
    return {
        "id": str(team.id),
        "name": team.name,
        "join_code": team.join_code,
        "leader_id": str(team.leader_id),
        "ps_id": str(team.ps_id) if team.ps_id else None,
        "members": [{"id": str(m.id), "name": m.name, "email": m.email} for m in team.members],
        "problem_statement": {
            "id": str(team.problem_statement.id),
            "title": team.problem_statement.title
        } if team.problem_statement else None
    }

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

@router.post("/leave")
async def leave_team(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not user.team_id:
        raise HTTPException(status_code=400, detail="You are not part of any team.")
        
    result = await db.execute(
        select(Team).options(selectinload(Team.members)).where(Team.id == user.team_id)
    )
    team = result.scalars().first()
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found.")
        
    if team.leader_id == user.id:
        # Leader leaves -> Disband team
        # 1. Remove all members
        for member in team.members:
            member.team_id = None
        
        # 2. Delete final submission if exists
        sub_result = await db.execute(select(FinalSubmission).where(FinalSubmission.team_id == team.id))
        submission = sub_result.scalars().first()
        if submission:
            await db.delete(submission)
            
        # 3. Delete team
        await db.delete(team)
        await db.commit()
        return {"message": "Team disbanded successfully"}
    else:
        # Standard member leaves
        user.team_id = None
        await db.commit()
        return {"message": "Left team successfully"}


class JoinTeamRequest(BaseModel):
    join_code: str

@router.post("/join")
async def join_team(req: JoinTeamRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user.team_id is not None:
        raise HTTPException(status_code=400, detail="You are already part of a team.")
        
    result = await db.execute(
        select(Team).options(selectinload(Team.members)).where(Team.join_code == req.join_code)
    )
    team = result.scalars().first()
    
    if not team:
        raise HTTPException(status_code=404, detail="Invalid join code.")
        
    if len(team.members) >= 4:
        raise HTTPException(status_code=400, detail="Team capacity reached (Max 4).")
        
    user.team_id = team.id
    await db.commit()
    
    return {"message": "Joined team successfully"}
