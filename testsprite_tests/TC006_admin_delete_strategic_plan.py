import requests

BASE_URL_AUTH = "http://localhost:3000/api/auth"
BASE_URL_SP = "http://localhost:3000/api/strategic-plan"
TIMEOUT = 30

EMAIL = "admin@example.com"
PASSWORD = "Admin@123456"


def authenticate_admin():
    session = requests.Session()
    # Step a) Get CSRF token
    r = session.get(f"{BASE_URL_AUTH}/csrf", timeout=TIMEOUT)
    r.raise_for_status()
    csrf_token = r.json().get("csrfToken")
    assert csrf_token, "CSRF token not found in auth/csrf response"

    # Step b) POST to credentials callback with form-data
    data = {
        "csrfToken": csrf_token,
        "email": EMAIL,
        "password": PASSWORD,
        "json": "true",
        "redirect": "false",
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }
    r = session.post(f"{BASE_URL_AUTH}/callback/credentials", data=data, headers=headers, timeout=TIMEOUT)
    r.raise_for_status()
    # Check if login was successful by presence of session cookie and response json success
    assert r.status_code == 200, f"Login failed with status code {r.status_code}"
    json_resp = r.json()
    assert "ok" in json_resp or "url" in json_resp or "csrfToken" not in json_resp, "Login response unexpected"

    # Session cookies are stored inside session
    return session


def create_strategic_plan(session):
    # Create a strategic plan used for delete testing
    payload = {
        "title": "Test Plan for Deletion",
        "slug": "test-plan-for-deletion",
        "content": "This is a test strategic plan created for delete testing.",
        "priority": "MEDIUM",
        "status": "DRAFT",
    }
    headers = {"Content-Type": "application/json"}
    r = session.post(f"{BASE_URL_SP}", json=payload, headers=headers, timeout=TIMEOUT)
    r.raise_for_status()
    assert r.status_code == 201, f"Strategic plan creation failed with status {r.status_code}"
    plan = r.json()
    plan_id = plan.get("id")
    if not plan_id:
        # Sometimes id might be named differently; fallback to slug or raise
        plan_id = plan.get("_id") or plan.get("ID") or plan.get("Id")
    assert plan_id, "Created strategic plan did not return an ID"
    return plan_id


def delete_strategic_plan(session, plan_id):
    r = session.delete(f"{BASE_URL_SP}/{plan_id}", timeout=TIMEOUT)
    if r.status_code not in (200, 204, 404):
        # 404 might happen if already deleted
        r.raise_for_status()


def test_admin_delete_strategic_plan():
    session = authenticate_admin()

    plan_id = create_strategic_plan(session)
    try:
        # Now delete using admin DELETE /{id}
        r = session.delete(f"{BASE_URL_SP}/{plan_id}", timeout=TIMEOUT)
        assert r.status_code == 200, f"Expected status 200 on delete, got {r.status_code}"
        # Optionally check response body to confirm deletion message or structure
        # Also verify the plan is no longer retrievable
        r_get = session.get(f"{BASE_URL_SP}/{plan_id}", timeout=TIMEOUT)
        # The get endpoint with /{id} for admin is not fully defined; safe to assume 404 or error
        assert r_get.status_code in (404, 400), f"Expected 404 or 400 after deletion, got {r_get.status_code}"
    finally:
        # Cleanup: ensure the test plan is deleted even if test assertions fail
        try:
            delete_strategic_plan(session, plan_id)
        except Exception:
            pass


test_admin_delete_strategic_plan()