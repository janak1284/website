import asyncio
from sqlalchemy import text
from database import AsyncSessionLocal

async def add_column():
    async with AsyncSessionLocal() as session:
        print("Adding column selected_track to teams table...")
        # Since problem_statements already uses TrackType, the tracktype enum should exist.
        # We can add the column of type tracktype. If it doesn't work, we can try varchar.
        try:
            await session.execute(text("ALTER TABLE teams ADD COLUMN selected_track tracktype;"))
            await session.commit()
            print("Successfully added selected_track column as tracktype.")
        except Exception as e:
            print("Failed to add as tracktype:", e)
            await session.rollback()
            try:
                print("Trying to add as VARCHAR...")
                await session.execute(text("ALTER TABLE teams ADD COLUMN selected_track VARCHAR(20);"))
                await session.commit()
                print("Successfully added selected_track column as VARCHAR.")
            except Exception as e2:
                print("Failed to add as VARCHAR:", e2)

if __name__ == "__main__":
    asyncio.run(add_column())
