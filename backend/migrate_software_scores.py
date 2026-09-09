import asyncio
import os
import json
from dotenv import load_dotenv
import asyncpg

async def migrate_software_scores():
    # Load environment variables
    load_dotenv()
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("Error: DATABASE_URL environment variable not set.")
        return
        
    if database_url.startswith("postgresql+asyncpg://"):
        database_url = database_url.replace("postgresql+asyncpg://", "postgresql://", 1)

    print("Connecting to database...")
    conn = await asyncpg.connect(database_url)
    
    try:
        # 3. Database Transaction & Constraint Safety
        async with conn.transaction():
            print("Fetching software scores...")
            # 1. Identify Software Scores (Hardware track is untouched)
            records = await conn.fetch("SELECT * FROM scores WHERE track = 'software'")
            
            # 2. Group and Average by Team
            teams = {}
            for row in records:
                team_id = row['team_id']
                if team_id not in teams:
                    teams[team_id] = []
                teams[team_id].append(row)
                
            print(f"Found {len(records)} software score entries across {len(teams)} teams.")
            
            for team_id, scores in teams.items():
                if len(scores) == 1:
                    score = scores[0]
                    if score['round_number'] != 2:
                        await conn.execute(
                            "UPDATE scores SET round_number = 2 WHERE team_id = $1 AND track = 'software' AND round_number = $2",
                            team_id, score['round_number']
                        )
                        print(f"Team {team_id}: 1 score -> Updated round_number to 2. Total: {score['total_score']}")
                    else:
                        print(f"Team {team_id}: 1 score -> Already Round 2. Skipped.")
                else:
                    # Keep the judge_id from the latest score entry
                    # Sort scores by created_at or id to get the latest, fallback to array order
                    if 'created_at' in scores[0]:
                        scores.sort(key=lambda x: x['created_at'])
                    elif 'id' in scores[0]:
                        scores.sort(key=lambda x: x['id'])
                        
                    latest_score = scores[-1]
                    
                    # Calculate arithmetic average of total_score
                    total_scores = [float(s['total_score']) for s in scores if s['total_score'] is not None]
                    avg_total = round(sum(total_scores) / len(total_scores), 2) if total_scores else 0.0
                    
                    # Parse the breakdown JSONB objects
                    breakdowns = []
                    for s in scores:
                        bd = s['breakdown']
                        # Handle asyncpg decoding if it returns a string
                        if isinstance(bd, str):
                            try:
                                bd = json.loads(bd)
                            except json.JSONDecodeError:
                                bd = {}
                        if bd:
                            breakdowns.append(bd)
                    
                    # Calculate mean value of numerical ratings across entries
                    avg_breakdown = {}
                    if breakdowns:
                        all_keys = set(k for bd in breakdowns for k in bd.keys())
                        for key in all_keys:
                            vals = [float(bd[key]) for bd in breakdowns if key in bd and isinstance(bd[key], (int, float))]
                            if vals:
                                avg_breakdown[key] = round(sum(vals) / len(vals), 2)
                                
                    # Construct single consolidated score record
                    latest_score_dict = dict(latest_score)
                    latest_score_dict['round_number'] = 2
                    latest_score_dict['total_score'] = avg_total
                    latest_score_dict['breakdown'] = json.dumps(avg_breakdown)
                    
                    keys = list(latest_score_dict.keys())
                    values = [latest_score_dict[k] for k in keys]
                    
                    # Build placeholders, casting breakdown to jsonb to avoid postgres type errors
                    placeholders = []
                    for i, k in enumerate(keys):
                        idx = i + 1
                        if k == 'breakdown':
                            placeholders.append(f"${idx}::jsonb")
                        else:
                            placeholders.append(f"${idx}")
                            
                    placeholders_str = ", ".join(placeholders)
                    cols = ", ".join(keys)
                    
                    # Delete the raw software score entries for this team
                    await conn.execute(
                        "DELETE FROM scores WHERE team_id = $1 AND track = 'software'",
                        team_id
                    )
                    
                    # Insert the single unified record
                    query = f"INSERT INTO scores ({cols}) VALUES ({placeholders_str})"
                    await conn.execute(query, *values)
                    
                    print(f"Team {team_id}: {len(scores)} scores -> Consolidated to Round 2. New Avg Total: {avg_total}")
                    
            print("\nMigration completed successfully.")
            
    except Exception as e:
        print(f"\nMigration failed: {e}")
        # The transaction will automatically rollback when leaving the async with block
        raise
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(migrate_software_scores())
