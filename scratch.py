import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, selectinload
from sqlalchemy.future import select
from models import User, Team
import uuid

import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def main():
    engine = create_async_engine(DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Create a user
        u = User(email=f"test_{uuid.uuid4()}@example.com", name="Test")
        session.add(u)
        await session.commit()
        await session.refresh(u)
        print(f"Created user: {u.id}")
        
        # Create a team like in create_team
        new_team = Team(name=f"Team_{uuid.uuid4()}", join_code="123456", leader_id=u.id)
        session.add(new_team)
        await session.commit()
        await session.refresh(new_team)
        
        u.team_id = new_team.id
        await session.commit()
        print(f"Created team: {new_team.id}")
        
    async with async_session() as session2:
        result = await session2.execute(
            select(User)
            .options(
                selectinload(User.team),
                selectinload(User.led_team)
            )
            .where(User.id == u.id)
        )
        loaded_u = result.scalars().first()
        print(f"Loaded user: {loaded_u.id}")
        print(f"User team: {loaded_u.team}")
        print(f"User led_team: {loaded_u.led_team}")
        
        # Cleanup
        await session2.delete(loaded_u.led_team)
        await session2.delete(loaded_u)
        await session2.commit()
        
asyncio.run(main())
