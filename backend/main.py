import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from auth import router as auth_router
from routers.teams import router as teams_router
from routers.ps import router as ps_router
from routers.submissions import router as submissions_router

app = FastAPI(title="Resonance 1.0 API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://resoancevitc.in",
        "https://www.resoancevitc.in",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(teams_router)
app.include_router(ps_router)
app.include_router(submissions_router)

@app.get("/")
async def root():
    return {"message": "Resonance 1.0 API is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
