import requests

BASE_AUTH_URL = "http://localhost:3000/api/auth"
BASE_STRATEGIC_PLAN_URL = "http://localhost:3000/api/strategic-plan"
EMAIL = "admin@example.com"
PASSWORD = "Admin@123456"
TIMEOUT = 30


def admin_get_all_strategic_plans():
    session = requests.Session()
    try:
        # Step 1: Get CSRF Token
        csrf_resp = session.get(f"{BASE_AUTH_URL}/csrf", timeout=TIMEOUT)
        csrf_resp.raise_for_status()
        csrf_token = csrf_resp.json().get("csrfToken")
        assert csrf_token, "CSRF token not found in response"

        # Step 2: Authenticate and obtain session cookie
        login_data = {
            "csrfToken": csrf_token,
            "email": EMAIL,
            "password": PASSWORD,
            "json": "true",
            "redirect": "false"
        }
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        }
        login_resp = session.post(
            f"{BASE_AUTH_URL}/callback/credentials",
            data=login_data,
            headers=headers,
            timeout=TIMEOUT,
            allow_redirects=False
        )
        login_resp.raise_for_status()

        # Confirm session cookie exists
        assert "set-cookie" in login_resp.headers or session.cookies.get_dict(), "Authentication failed, no session cookie received"

        # Step 3: Use the session cookie to call admin GET /strategic-plan endpoint
        admin_resp = session.get(f"{BASE_STRATEGIC_PLAN_URL}", timeout=TIMEOUT)
        admin_resp.raise_for_status()
        plans = admin_resp.json()

        # Validate response structure: must be a list (usually a list of dict)
        assert isinstance(plans, list), "Expected response to be a list"

    except requests.RequestException as e:
        assert False, f"Request failed: {e}"


admin_get_all_strategic_plans()