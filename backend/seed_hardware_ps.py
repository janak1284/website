import asyncio
from database import AsyncSessionLocal
from models import ProblemStatement, TrackType

async def seed_hardware_ps():
    async with AsyncSessionLocal() as session:
        async with session.begin():
            description = "Teams can identify ANY real-world problem or situation within the given areas and develop an innovative Hardware / Hardware + Software solution for it.\n\nParticipants are required to bring the hardware components they believe will be useful based on the area they choose to work on. We recommend bringing versatile components that can be adapted to different solutions."
            
            ps1 = ProblemStatement(
                title="AgriTech + IoT + AI",
                description=description,
                track=TrackType.hardware,
                max_quota=50,
                is_active=True
            )
            
            ps2 = ProblemStatement(
                title="ClimateTech + IoT + AI",
                description=description,
                track=TrackType.hardware,
                max_quota=50,
                is_active=True
            )
            
            session.add_all([ps1, ps2])
            
        print("Hardware Problem Statements seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_hardware_ps())
