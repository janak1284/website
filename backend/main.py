import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import router as auth_router
from routers.teams import router as teams_router
from routers.users import router as users_router
from routers.ps import router as ps_router
from routers.submissions import router as submissions_router
from routers.admin import router as admin_router
from auth_judging import router as auth_judging_router
from routers.judging import router as judging_router

app = FastAPI(title="Resonance 1.0 API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://resonancevitc.in",
        "https://www.resonancevitc.in",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(teams_router)
app.include_router(ps_router)
app.include_router(submissions_router)
app.include_router(admin_router)
app.include_router(auth_judging_router)
app.include_router(judging_router)

@app.get("/")
async def root():
    return {"message": "Resonance 1.0 API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
