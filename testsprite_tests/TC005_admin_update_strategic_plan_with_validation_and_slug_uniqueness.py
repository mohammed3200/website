import requests
from requests.exceptions import RequestException
import json

BASE_AUTH_URL = "http://localhost:3000/api/auth"
BASE_STRATEGIC_PLAN_URL = "http://localhost:3000/api/strategic-plan"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "Admin@123456"
TIMEOUT = 30

def authenticate_admin():
    session = requests.Session()
    try:
        # Step a) Get CSRF token
        r = session.get(f"{BASE_AUTH_URL}/csrf", timeout=TIMEOUT)
        r.raise_for_status()
        csrf_token = r.json().get("csrfToken")
        assert csrf_token, "No csrfToken found in CSRF response"

        # Step b) Post credentials to callback
        payload = {
            "csrfToken": csrf_token,
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
            "json": "true",
            "redirect": "false"
        }
        headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        r = session.post(f"{BASE_AUTH_URL}/callback/credentials", data=payload, headers=headers, timeout=TIMEOUT)
        r.raise_for_status()
        resp_json = r.json()
        assert resp_json.get("ok") is True or resp_json.get("status") == "OK" or r.status_code == 200, "Authentication failed"

        # Session cookie is stored automatically in session
        return session
    except (RequestException, AssertionError) as e:
        raise RuntimeError(f"Admin authentication failed: {e}")

def create_strategic_plan(session, plan_data):
    try:
        r = session.post(BASE_STRATEGIC_PLAN_URL, json=plan_data, timeout=TIMEOUT)
        r.raise_for_status()
        assert r.status_code == 201
        created = r.json()
        created_id = created.get("id")
        assert created_id, "Created strategic plan missing 'id'"
        return created_id
    except (RequestException, AssertionError) as e:
        raise RuntimeError(f"Failed to create strategic plan: {e}")

def delete_strategic_plan(session, plan_id):
    try:
        r = session.delete(f"{BASE_STRATEGIC_PLAN_URL}/{plan_id}", timeout=TIMEOUT)
        r.raise_for_status()
        assert r.status_code == 200
    except RequestException:
        # Best effort cleanup; ignore exceptions here
        pass

def admin_update_strategic_plan_with_validation_and_slug_uniqueness():
    session = authenticate_admin()

    # Create initial strategic plan to update
    original_plan = {
        "title": "Initial Test Plan",
        "slug": "initial-test-plan",
        "content": "This is the original content.",
        "priority": "MEDIUM",
        "status": "DRAFT"
    }

    # Create another strategic plan to test slug uniqueness enforcement during update
    conflicting_plan = {
        "title": "Conflicting Plan",
        "slug": "conflicting-plan",
        "content": "Conflicting content.",
        "priority": "LOW",
        "status": "DRAFT"
    }

    original_id = None
    conflicting_id = None

    try:
        original_id = create_strategic_plan(session, original_plan)
        conflicting_id = create_strategic_plan(session, conflicting_plan)

        # Update the original plan with valid data including changing slug uniquely
        update_data = {
            "title": "Updated Test Plan",
            "slug": "updated-test-plan",
            "content": "This is the updated content.",
            "priority": "HIGH",
            "status": "UNDER_REVIEW"
        }
        r = session.patch(f"{BASE_STRATEGIC_PLAN_URL}/{original_id}", json=update_data, timeout=TIMEOUT)
        r.raise_for_status()
        assert r.status_code == 200
        response_data = r.json()
        # Validate response fields reflect update (at least check updated fields)
        assert response_data.get("title") == update_data["title"]
        assert response_data.get("slug") == update_data["slug"]
        assert response_data.get("content") == update_data["content"]
        assert response_data.get("priority") == update_data["priority"]
        assert response_data.get("status") == update_data["status"]

        # Try to update the original plan with a slug that duplicates the conflicting plan's slug - should fail
        duplicate_slug_data = {
            "slug": conflicting_plan["slug"]
        }
        r = session.patch(f"{BASE_STRATEGIC_PLAN_URL}/{original_id}", json=duplicate_slug_data, timeout=TIMEOUT)
        # We expect failure due to slug uniqueness enforcement
        assert r.status_code >= 400, "Updating with duplicate slug did not fail as expected"
        error_resp = r.json()
        # Expect meaningful error message about slug uniqueness
        error_message = json.dumps(error_resp).lower()
        assert "slug" in error_message and ("unique" in error_message or "duplicate" in error_message), "Error message does not mention slug uniqueness"

        # Test input validation: try update with invalid field type (e.g., priority invalid enum)
        invalid_update_data = {
            "priority": "INVALID_PRIORITY"
        }
        r = session.patch(f"{BASE_STRATEGIC_PLAN_URL}/{original_id}", json=invalid_update_data, timeout=TIMEOUT)
        assert r.status_code >= 400, "Updating with invalid field did not fail as expected"
        error_resp = r.json()
        error_message = json.dumps(error_resp).lower()
        assert "priority" in error_message or "validation" in error_message or "zod" in error_message or "enum" in error_message

    finally:
        if original_id:
            delete_strategic_plan(session, original_id)
        if conflicting_id:
            delete_strategic_plan(session, conflicting_id)

admin_update_strategic_plan_with_validation_and_slug_uniqueness()