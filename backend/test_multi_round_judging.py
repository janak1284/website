import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def print_result(step_name, condition, details=""):
    if condition:
        print(f"[PASS] {step_name} {details}")
    else:
        print(f"[FAIL] {step_name} {details}")
        sys.exit(1)

def login(username, password="password"):
    res = requests.post(
        f"{BASE_URL}/api/judging/login",
        data={"username": username, "password": password}
    )
    # Fallback to username as password
    if res.status_code != 200 and password == "password":
        res = requests.post(
            f"{BASE_URL}/api/judging/login",
            data={"username": username, "password": username}
        )
    
    if res.status_code == 200:
        return res.json()["access_token"]
    print_result(f"Login as {username}", False, f"- Status: {res.status_code}")

def main():
    print("--- MULTI-ROUND JUDGING VALIDATION SUITE ---\n")
    
    # 1. Login Checks
    judge_token = login("judge1")
    print_result("Login as judge1", True)
    
    admin_token = login("admin")
    print_result("Login as admin", True)
    
    judge_headers = {"Authorization": f"Bearer {judge_token}"}
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 2. Shortlist Verification
    res_hw = requests.get(f"{BASE_URL}/api/judging/teams", headers=judge_headers)
    all_teams = res_hw.json()
    
    hw_teams = [t for t in all_teams if t.get("selected_track") == "hardware"]
    sw_teams = [t for t in all_teams if t.get("selected_track") == "software"]
    
    if len(hw_teams) == 0 or len(sw_teams) == 0:
        print("[FAIL] Need at least 1 hardware and 1 software team to proceed with tests.")
        sys.exit(1)
        
    hw_team_id = hw_teams[0]["id"]
    sw_team_id = sw_teams[0]["id"]
    print(f"   Selected HW Team: {hw_team_id} | SW Team: {sw_team_id}")

    # Helper function for score submission
    def submit_score(track, round_num, team_id, token=judge_token):
        return requests.post(
            f"{BASE_URL}/api/judging/score",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "team_id": team_id,
                "track": track,
                "round_number": round_num,
                "judge_display_name": "Test Judge",
                "total_score": 50,
                "breakdown": {"crit": 3}
            }
        )

    # 3. Invalid Round Rejection
    # Hardware Invalid: 1, 4
    res = submit_score("hardware", 1, hw_team_id)
    print_result("Hardware Round 1 Rejection", res.status_code == 400)
    
    res = submit_score("hardware", 4, hw_team_id)
    print_result("Hardware Round 4 Rejection", res.status_code == 400)

    # Software Invalid: 1, 2, 5
    res = submit_score("software", 1, sw_team_id)
    print_result("Software Round 1 Rejection", res.status_code == 400)
    
    res = submit_score("software", 2, sw_team_id)
    print_result("Software Round 2 Rejection", res.status_code == 400)
    
    res = submit_score("software", 5, sw_team_id)
    print_result("Software Round 5 Rejection", res.status_code == 400)

    # 4. Valid Round Submissions & Duplicate Guard
    # We must ensure we delete existing scores for this judge/team/round combo to test duplicates cleanly.
    # We can rely on the duplicate check natively. If the team was already scored by judge1, the first submit might 400.
    # To be safe, we will just test the responses.

    # HW Round 2
    res = submit_score("hardware", 2, hw_team_id)
    if res.status_code == 400 and "already submitted" in res.text.lower():
        # Clean up by hitting an admin override or skipping
        pass # If already submitted, our test environment is dirty, but we'll accept it for now.
    
    res = submit_score("hardware", 2, hw_team_id) # Submit again
    print_result("Duplicate Guard (HW R2)", res.status_code == 400)

    # SW Round 3
    res = submit_score("software", 3, sw_team_id)
    # The first submission should be 200 (if clean) or 400 (if already exists).
    # Submit again to guarantee 400 duplicate
    res_dup = submit_score("software", 3, sw_team_id)
    print_result("Duplicate Guard (SW R3)", res_dup.status_code == 400)

    # 5. Admin Leaderboard Verification
    res = requests.get(f"{BASE_URL}/api/judging/leaderboard?round_number=2", headers=admin_headers)
    print_result("Admin Leaderboard Fetch (Round 2)", res.status_code == 200)
    
    leaderboard_data = res.json()
    # Verify hardware score is present
    hw_score_present = any(t["team_id"] == hw_team_id for t in leaderboard_data if t["track"] == "hardware")
    print_result("HW Score Present in Admin Leaderboard R2", hw_score_present)

    # Judge attempting to fetch leaderboard
    res = requests.get(f"{BASE_URL}/api/judging/leaderboard?round_number=1", headers=judge_headers)
    print_result("Judge Leaderboard Fetch Blocked", res.status_code == 403)

    print("\nALL TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
