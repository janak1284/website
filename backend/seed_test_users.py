import os
from dotenv import load_dotenv
import asyncio
import asyncpg
from passlib.context import CryptContext

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed_users():
    # Convert postgresql+asyncpg:// to postgres:// for asyncpg
    dsn = os.getenv("DATABASE_URL").replace("postgresql+asyncpg://", "postgres://")
    dsn = dsn.replace("postgresql://", "postgres://")

    conn = await asyncpg.connect(dsn)
    
    hashed_pw = pwd_context.hash("password")
    
    # Check admin
    admin_exists = await conn.fetchval("SELECT id FROM judging_staff WHERE username = 'admin'")
    if admin_exists:
        await conn.execute("UPDATE judging_staff SET hashed_password = $1 WHERE username = 'admin'", hashed_pw)
    else:
        await conn.execute("INSERT INTO judging_staff (id, username, hashed_password, role) VALUES (gen_random_uuid(), 'admin', $1, 'admin')", hashed_pw)
        
    # Check judge1
    judge1_exists = await conn.fetchval("SELECT id FROM judging_staff WHERE username = 'judge1'")
    if judge1_exists:
        await conn.execute("UPDATE judging_staff SET hashed_password = $1 WHERE username = 'judge1'", hashed_pw)
    else:
        await conn.execute("INSERT INTO judging_staff (id, username, hashed_password, role) VALUES (gen_random_uuid(), 'judge1', $1, 'judge')", hashed_pw)
    
    print("Seed complete.")
    await conn.close()

if __name__ == "__main__":
    asyncio.run(seed_users())
