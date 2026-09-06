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
            # Add round_number
            await conn.execute(text("ALTER TABLE scores ADD COLUMN round_number INTEGER NOT NULL DEFAULT 1;"))
            print("Added round_number column.")
        except Exception as e:
            print(f"Error adding round_number (might already exist): {e}")

        try:
            # Add overwritten_by_admin_id
            await conn.execute(text("ALTER TABLE scores ADD COLUMN overwritten_by_admin_id UUID;"))
            await conn.execute(text("ALTER TABLE scores ADD CONSTRAINT fk_scores_admin FOREIGN KEY (overwritten_by_admin_id) REFERENCES judging_staff(id);"))
            print("Added overwritten_by_admin_id column and FK constraint.")
        except Exception as e:
            print(f"Error adding overwritten_by_admin_id (might already exist): {e}")

        try:
            # Add UniqueConstraint
            await conn.execute(text("ALTER TABLE scores ADD CONSTRAINT uix_team_round UNIQUE (team_id, round_number);"))
            print("Added unique constraint uix_team_round.")
        except Exception as e:
            print(f"Error adding unique constraint (might already exist): {e}")

    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(run_migration())
