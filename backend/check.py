import asyncio, os, asyncpg
from dotenv import load_dotenv

async def check():
    load_dotenv()
    db_url = os.getenv('DATABASE_URL').replace('postgresql+asyncpg://', 'postgresql://', 1)
    conn = await asyncpg.connect(db_url)
    t_id = 'bf7b91e9-9f7e-4871-b0e6-2b1b15929747'
    t = await conn.fetchrow("SELECT * FROM teams WHERE id = $1", t_id)
    print("Team:", dict(t) if t else None)
    
    try:
        s = await conn.fetchrow("SELECT * FROM shortlisted_team WHERE id = $1", t_id)
        print("Shortlisted:", dict(s) if s else None)
    except Exception as e:
        print("Shortlisted error:", e)
        
    sc = await conn.fetch("SELECT * FROM scores WHERE team_id = $1", t_id)
    print("Scores:", [dict(x) for x in sc])
    
    u = await conn.fetch("SELECT * FROM users WHERE team_id = $1", t_id)
    print("Users for team:", [dict(x) for x in u])
    
    await conn.close()

asyncio.run(check())
