from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel

from database import get_db
from models import User, FinalSubmission
from auth import get_current_user

router = APIRouter(prefix="/api/submissions", tags=["submissions"])

class FinalSubmissionRequest(BaseModel):
    github_url: str
    demo_link: str

@router.post("/final")
async def submit_final(req: FinalSubmissionRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not user.team_id:
        raise HTTPException(status_code=400, detail="User is not in a team")
        
    result = await db.execute(select(FinalSubmission).where(FinalSubmission.team_id == user.team_id))
    submission = result.scalars().first()
    
    if submission:
        submission.github_url = req.github_url
        submission.demo_link = req.demo_link
    else:
        submission = FinalSubmission(
            team_id=user.team_id,
            github_url=req.github_url,
            demo_link=req.demo_link
        )
        db.add(submission)
        
    await db.commit()
    await db.refresh(submission)
    
    return {"message": "Final submission saved", "submission_id": submission.id}
