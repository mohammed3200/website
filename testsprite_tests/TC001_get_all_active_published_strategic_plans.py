import requests

BASE_URL = "http://localhost:3000/api/strategic-plan"
TIMEOUT = 30

def test_get_all_active_published_strategic_plans():
    url = f"{BASE_URL}/public"
    try:
        response = requests.get(url, timeout=TIMEOUT)
        response.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Request to GET /public failed: {e}"

    # Validate status code
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"

    # Validate Cache-Control header for 5 minutes (300 seconds)
    cache_control = response.headers.get("Cache-Control")
    assert cache_control is not None, "Cache-Control header is missing"
    # Cache-Control can have multiple directives, check for max-age=300 presence
    assert "max-age=300" in cache_control, f"Expected 'max-age=300' in Cache-Control header, got '{cache_control}'"

    # Validate response content is a list of plans
    try:
        plans = response.json()
    except Exception as e:
        assert False, f"Response is not valid JSON: {e}"

    assert isinstance(plans, list), f"Expected JSON response to be a list, got {type(plans)}"

    # Validate each plan is active and published
    # Since schema enums for status are: DRAFT, UNDER_REVIEW, APPROVED, PUBLISHED, ARCHIVED
    # We expect only plans with status "PUBLISHED" returned.
    # Active is interpreted as status "PUBLISHED" only as per requirements.
    for plan in plans:
        assert isinstance(plan, dict), f"Each plan item should be a dict, got {type(plan)}"
        status = plan.get("status")
        assert status == "PUBLISHED", f"Plan status expected to be 'PUBLISHED', got '{status}'"

def run():
    test_get_all_active_published_strategic_plans()

run()
