import asyncio
from sqlalchemy.future import select
from database import AsyncSessionLocal, engine
from models import ProblemStatement, TrackType

async def seed_db():
    async with AsyncSessionLocal() as session:
        # Check if data already exists
        result = await session.execute(select(ProblemStatement))
        existing_ps = result.scalars().first()
        
        if existing_ps:
            print("Database already seeded with problem statements. Exiting safely.")
            return

        print("Seeding database with problem statements...")
        
        dummy_ps = [
            ProblemStatement(
                title="AI-Powered Accessibility Assistant",
                description="Develop an application that leverages AI to assist individuals with disabilities in their daily digital interactions.",
                track=TrackType.software,
                max_quota=3
            ),
            ProblemStatement(
                title="Smart Agriculture IoT Sensor Network",
                description="Design a low-power, robust IoT sensor node capable of monitoring soil moisture, temperature, and crop health in real-time.",
                track=TrackType.hardware,
                max_quota=3
            ),
            ProblemStatement(
                title="Decentralized Supply Chain Tracker",
                description="Create a blockchain-based system to transparently track and verify the origins and journey of sustainable goods.",
                track=TrackType.software,
                max_quota=3
            ),
            ProblemStatement(
                title="Renewable Energy Micro-Grid Controller",
                description="Build a hardware controller that intelligently distributes power between solar, battery, and grid sources for a smart home.",
                track=TrackType.hardware,
                max_quota=3
            ),
            ProblemStatement(
                title="Next-Gen Cybersecurity Threat Detection",
                description="Develop a machine learning model capable of detecting novel zero-day network intrusions with high accuracy.",
                track=TrackType.software,
                max_quota=3
            )
        ]
        
        session.add_all(dummy_ps)
        await session.commit()
        
        print("Successfully seeded 5 problem statements into the database!")

if __name__ == "__main__":
    asyncio.run(seed_db())
