import asyncio
from sqlalchemy import text
from database import engine

async def main():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE users ALTER COLUMN name DROP NOT NULL;"))
            print("Dropped NOT NULL constraint on name.")
        except Exception as e:
            print(f"Error dropping NOT NULL on name: {e}")
            
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN participant_type VARCHAR;"))
            print("Added participant_type column.")
        except Exception as e:
            print(f"Error adding participant_type column: {e}")
            
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN assigned_software VARCHAR;"))
            print("Added assigned_software column.")
        except Exception as e:
            print(f"Error adding assigned_software column: {e}")

if __name__ == "__main__":
    asyncio.run(main())
