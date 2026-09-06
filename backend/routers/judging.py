from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Dict, Any, List
import uuid

from database import get_db
from models import JudgingStaff, Score, Team, JudgingRole
from auth_judging import get_current_judging_staff, get_judging_admin

router = APIRouter(prefix="/api/judging", tags=["judging"])

class ScoreRequest(BaseModel):
    team_id: str
    track: str
    round_number: int
    total_score: float
    breakdown: Dict[str, Any]
    judge_display_name: str

@router.get("/teams")
async def get_teams(
    staff: JudgingStaff = Depends(get_current_judging_staff), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Team).options(selectinload(Team.scores)))
    teams = result.scalars().unique().all()
    return [
        {
            "id": str(t.id), 
            "name": t.name, 
            "selected_track": getattr(t.selected_track, 'value', t.selected_track),
            "scored_rounds": [s.round_number for s in t.scores]
        } 
        for t in teams
    ]

@router.post("/score")
async def submit_score(
    req: ScoreRequest, 
    staff: JudgingStaff = Depends(get_current_judging_staff), 
    db: AsyncSession = Depends(get_db)
):
    try:
        target_team_id = uuid.UUID(req.team_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid team ID format")

    if req.track == 'software' and (req.round_number < 1 or req.round_number > 4):
        raise HTTPException(status_code=400, detail="Software track only has rounds 1-4")
    if req.track == 'hardware' and (req.round_number < 1 or req.round_number > 2):
        raise HTTPException(status_code=400, detail="Hardware track only has rounds 1-2")

    team_res = await db.execute(select(Team).where(Team.id == target_team_id))
    team = team_res.scalars().first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    existing_score = await db.execute(
        select(Score).where(Score.team_id == target_team_id, Score.round_number == req.round_number)
    )
    score_obj = existing_score.scalars().first()

    if score_obj:
        if staff.role != JudgingRole.admin:
            raise HTTPException(status_code=409, detail="This team has already been scored for this round.")
        else:
            score_obj.total_score = req.total_score
            score_obj.breakdown = req.breakdown
            score_obj.judge_display_name = req.judge_display_name
            score_obj.overwritten_by_admin_id = staff.id
            await db.commit()
            return {"message": "Score overwritten successfully"}

    new_score = Score(
        team_id=target_team_id,
        judge_id=staff.id,
        judge_display_name=req.judge_display_name,
        track=req.track,
        round_number=req.round_number,
        total_score=req.total_score,
        breakdown=req.breakdown
    )
    db.add(new_score)
    await db.commit()
    return {"message": "Score submitted successfully"}

@router.get("/leaderboard")
async def get_leaderboard(
    staff: JudgingStaff = Depends(get_judging_admin), 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Score)
        .options(selectinload(Score.team), selectinload(Score.judge))
    )
    scores = result.scalars().all()
    
    teams_dict = {}
    for s in scores:
        team_id_str = str(s.team_id)
        if team_id_str not in teams_dict:
            teams_dict[team_id_str] = {
                "team_id": team_id_str,
                "team_name": s.team.name if s.team else "Unknown",
                "track": s.track,
                "total_score": 0,
                "rounds": []
            }
        
        teams_dict[team_id_str]["total_score"] += s.total_score
        teams_dict[team_id_str]["rounds"].append({
            "score_id": str(s.id),
            "round_number": s.round_number,
            "judge_username": s.judge_display_name or (s.judge.username if s.judge else "Unknown"),
            "overwritten_by_admin": bool(s.overwritten_by_admin_id),
            "score": s.total_score,
            "breakdown": s.breakdown
        })
    
    leaderboard = list(teams_dict.values())
    leaderboard.sort(key=lambda x: x["total_score"], reverse=True)
    
    for team in leaderboard:
        team["rounds"].sort(key=lambda x: x["round_number"])

    return leaderboard

@router.delete("/score/{score_id}")
async def delete_score(
    score_id: str, 
    staff: JudgingStaff = Depends(get_judging_admin), 
    db: AsyncSession = Depends(get_db)
):
    try:
        target_score_id = uuid.UUID(score_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid score ID format")

    result = await db.execute(select(Score).where(Score.id == target_score_id))
    score = result.scalars().first()
    
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
        
    await db.delete(score)
    await db.commit()
    
    return {"message": "Score deleted successfully"}
