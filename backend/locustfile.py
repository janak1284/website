from locust import HttpUser, task, between

class FastApiUser(HttpUser):
    wait_time = between(0.1, 1.0) # mimic users continuously clicking

    @task(3)
    def get_ps(self):
        self.client.get("/api/ps")

    @task(1)
    def claim_ps(self):
        # We simulate hitting the claim endpoint.
        # Even if it returns 401 or 403, it hits the route, parses JSON, and does some basic work,
        # mimicking the request parsing overhead. If we had a valid token it would be more realistic,
        # but for a simple stress test this should give a reasonable baseline of peak request handling.
        self.client.post("/api/ps/claim", json={"ps_id": "00000000-0000-0000-0000-000000000000"})
