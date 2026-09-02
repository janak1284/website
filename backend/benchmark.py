import subprocess
import time
import psutil
import os
import sys

def get_memory(process):
    try:
        return process.memory_info().rss / (1024 * 1024)  # MB
    except psutil.NoSuchProcess:
        return 0

def run_test():
    print("Starting FastAPI app...")
    server_process = subprocess.Popen([sys.executable, "-m", "uvicorn", "main:app", "--port", "8000"], 
                                      stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Wait for it to start
    time.sleep(5)
    
    server_psutil = psutil.Process(server_process.pid)
    
    # Measure idle baseline
    idle_mem = get_memory(server_psutil)
    print(f"Idle Baseline Memory: {idle_mem:.2f} MB")
    
    print("Starting Locust load test (700 users)...")
    locust_cmd = [
        sys.executable, "-m", "locust", 
        "-f", "locustfile.py", 
        "--headless", 
        "-u", "700", 
        "-r", "100", 
        "-t", "20s", 
        "--host", "http://127.0.0.1:8000"
    ]
    locust_process = subprocess.Popen(locust_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    peak_mem = idle_mem
    while locust_process.poll() is None:
        current_mem = get_memory(server_psutil)
        if current_mem > peak_mem:
            peak_mem = current_mem
        time.sleep(0.5)
        
    print(f"Peak Memory during Load Test: {peak_mem:.2f} MB")
    
    server_process.terminate()
    server_process.wait()
    
    delta = peak_mem - idle_mem
    print(f"Active Request Handling Delta: {delta:.2f} MB")
    
    # Calculate for 4 workers
    workers = 4
    # db connection weight per worker
    db_weight = 150 # MB
    total_single_worker = peak_mem + db_weight
    total_multi_worker = (total_single_worker * workers) * 1.15
    
    print(f"\n--- Resource Calculation ---")
    print(f"Number of Workers: {workers}")
    print(f"Estimated DB Connection Overhead per worker: {db_weight} MB")
    print(f"Total single worker footprint (Peak + DB): {total_single_worker:.2f} MB")
    print(f"Total multi-worker estimate (+15% System Overhead): {total_multi_worker:.2f} MB")
    
    if total_multi_worker > 512:
        print("Verdict: A 512MB Heroku basic dyno WILL CRASH with an R14 error.")
    else:
        print("Verdict: A 512MB Heroku basic dyno is SUFFICIENT.")
        
    if total_multi_worker < 1024:
        print("Verdict: Deploying via Docker to a standard 1GB sponsor VM WILL HANDLE the traffic effortlessly.")
    elif total_multi_worker < 2048:
        print("Verdict: Deploying via Docker to a standard 2GB sponsor VM WILL HANDLE the traffic effortlessly.")

if __name__ == "__main__":
    run_test()
