import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from models import Base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create the async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,       # Instantly checks if the connection is alive
    pool_size=10,             # Maintains a healthy number of connections
    max_overflow=20,          # Allows burst connections during the hackathon
    pool_recycle=300          # Recycles connections every 5 minutes before Neon drops them
)

# Session factory for FastAPI dependency injection
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def init_db():
    """Creates all tables in Neon DB."""
    async with engine.begin() as conn:
        # Create tables (does not overwrite existing ones)
        await conn.run_sync(Base.metadata.create_all)

# FastAPI Dependency
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session