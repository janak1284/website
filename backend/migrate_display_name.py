import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set")

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=True)

async def run_migration():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE scores ADD COLUMN judge_display_name VARCHAR;"))
            print("Added judge_display_name column.")
        except Exception as e:
            print(f"Error adding judge_display_name (might already exist): {e}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(run_migration())
