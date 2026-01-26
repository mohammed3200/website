import requests

BASE_URL = "http://localhost:3000/api/strategic-plan"
TIMEOUT = 30

def test_get_strategic_plan_by_id_or_slug():
    session = requests.Session()
    headers = {"Accept": "application/json"}

    # Step 1: Get the list of public strategic plans to obtain a valid ID and slug
    try:
        list_resp = session.get(f"{BASE_URL}/public", headers=headers, timeout=TIMEOUT)
        assert list_resp.status_code == 200, f"Expected 200 OK but got {list_resp.status_code}"
        plans = list_resp.json()
        assert isinstance(plans, list) and len(plans) > 0, "Expected non-empty list of strategic plans"

        # Use first item's id and slug for test
        plan = plans[0]
        assert "id" in plan or "slug" in plan, "Plan must have 'id' or 'slug'"

        # Test by ID if available
        if "id" in plan and plan["id"]:
            plan_id = plan["id"]
            resp_by_id = session.get(f"{BASE_URL}/public/{plan_id}", headers=headers, timeout=TIMEOUT)
            assert resp_by_id.status_code == 200, f"Expected 200 for ID but got {resp_by_id.status_code}"
            data_id = resp_by_id.json()
            assert data_id.get("id") == plan_id or data_id.get("slug") == plan.get("slug"), "Returned plan does not match requested ID"

        # Test by slug if available
        if "slug" in plan and plan["slug"]:
            slug = plan["slug"]
            resp_by_slug = session.get(f"{BASE_URL}/public/{slug}", headers=headers, timeout=TIMEOUT)
            assert resp_by_slug.status_code == 200, f"Expected 200 for slug but got {resp_by_slug.status_code}"
            data_slug = resp_by_slug.json()
            assert data_slug.get("slug") == slug or data_slug.get("id") == plan.get("id"), "Returned plan does not match requested slug"

        # Test non-existent ID returns 404
        invalid_id = "non-existent-id-1234567890"
        resp_404 = session.get(f"{BASE_URL}/public/{invalid_id}", headers=headers, timeout=TIMEOUT)
        assert resp_404.status_code == 404, f"Expected 404 for non-existent ID but got {resp_404.status_code}"

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_get_strategic_plan_by_id_or_slug()