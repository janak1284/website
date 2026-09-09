from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import uuid

from database import get_db
from models import JudgingStaff, Score, Team, ShortlistedTeam, JudgingRole
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
    # Fetch exclusively from ShortlistedTeam
    result = await db.execute(select(ShortlistedTeam).where(ShortlistedTeam.selected_track.isnot(None)))
    shortlisted_teams_list = list(result.scalars().all())
    
    if not shortlisted_teams_list:
        return []

    # Exclude colliding team names if both are present
    team_a_id = "c82563c8-7b36-4dbc-a01b-0bace13c3d0e"
    team_b_id = "0b628b00-6314-4c71-adc7-c7c5f6e9f212"
    fetched_ids = {str(t.id) for t in shortlisted_teams_list}
    
    if team_a_id in fetched_ids and team_b_id in fetched_ids:
        shortlisted_teams = [t for t in shortlisted_teams_list if str(t.id) not in (team_a_id, team_b_id)]
    else:
        shortlisted_teams = shortlisted_teams_list
        
    if not shortlisted_teams:
        return []

    team_ids = [t.id for t in shortlisted_teams]
    scores_result = await db.execute(select(Score).where(Score.team_id.in_(team_ids)))
    scores = scores_result.scalars().all()
    
    team_scores = {str(t_id): [] for t_id in team_ids}
    for s in scores:
        team_scores[str(s.team_id)].append(s.round_number)

    return [
        {
            "id": str(t.id), 
            "name": t.name, 
            "selected_track": getattr(t.selected_track, 'value', t.selected_track),
            "scored_rounds": team_scores[str(t.id)]
        } 
        for t in shortlisted_teams
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

    if req.track == 'hardware':
        if req.round_number == 1:
            raise HTTPException(status_code=400, detail="Round 1 for Hardware is already completed")
        elif req.round_number not in [2, 3]:
            raise HTTPException(status_code=400, detail="Hardware track round must be 2 or 3")
            
    if req.track == 'software':
        if req.round_number in [1, 2]:
            raise HTTPException(status_code=400, detail="Round 1 & 2 for Software are closed")
        elif req.round_number not in [3, 4]:
            raise HTTPException(status_code=400, detail="Software track round must be 3 or 4")

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
            raise HTTPException(status_code=400, detail="This team has already been scored for this round.")
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
    round_number: Optional[int] = None,
    staff: JudgingStaff = Depends(get_judging_admin), 
    db: AsyncSession = Depends(get_db)
):
    query = select(Score).options(selectinload(Score.team), selectinload(Score.judge))
    if round_number is not None:
        query = query.where(Score.round_number == round_number)
        
    result = await db.execute(query)
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
