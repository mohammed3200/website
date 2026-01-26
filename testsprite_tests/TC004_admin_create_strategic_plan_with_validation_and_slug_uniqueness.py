import requests
import uuid

BASE_URL = "http://localhost:3000"
STRATEGIC_PLAN_URL = f"{BASE_URL}/api/strategic-plan"
AUTH_CSRF_URL = f"{BASE_URL}/api/auth/csrf"
AUTH_CALLBACK_URL = f"{BASE_URL}/api/auth/callback/credentials"
TIMEOUT = 30


def get_auth_session():
    try:
        # Step a: get csrf token
        r = requests.get(AUTH_CSRF_URL, timeout=TIMEOUT)
        r.raise_for_status()
        csrf_token = r.json().get("csrfToken")
        if not csrf_token:
            raise Exception("csrfToken not found in csrf response")

        # Step b: authenticate with credentials
        form_data = {
            "csrfToken": csrf_token,
            "email": "admin@example.com",
            "password": "Admin@123456",
            "json": "true",
            "redirect": "false",
        }
        r2 = requests.post(AUTH_CALLBACK_URL, data=form_data, timeout=TIMEOUT)
        r2.raise_for_status()

        # Step c: capture session cookie
        cookies = r2.cookies
        # check for cookies starting with expected prefixes
        if not any(c.name.startswith(prefix) for c in cookies for prefix in ["next-auth.session-token", "__Secure-next-auth.session-token"]):
            raise Exception("Session cookie not found in authentication response")

        return cookies
    except Exception as e:
        raise Exception(f"Authentication failed: {e}")


def test_admin_create_strategic_plan_with_validation_and_slug_uniqueness():
    session_cookies = get_auth_session()

    headers = {"Content-Type": "application/json"}

    slug_base = f"test-plan-{uuid.uuid4().hex[:8]}"

    created_plan_id = None

    # Helper to cleanup created plan
    def delete_plan(plan_id):
        if not plan_id:
            return
        try:
            del_res = requests.delete(f"{STRATEGIC_PLAN_URL}/{plan_id}", cookies=session_cookies, timeout=TIMEOUT)
            del_res.raise_for_status()
        except Exception:
            pass

    try:
        # 1) Validate required fields: send empty payload => expect 400 or validation error
        resp = requests.post(STRATEGIC_PLAN_URL, json={}, cookies=session_cookies, headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 400 or resp.status_code == 422, (
            f"Expected 400 or 422 when required fields missing but got {resp.status_code}"
        )
        resp_json = resp.json()
        # Expect error messages mentioning required fields
        assert any(field in str(resp_json).lower() for field in ["title", "slug", "content"]), "Missing required fields error not found"

        # 2) Create a new strategic plan with required fields => expect 201
        payload = {
            "title": "Test Strategic Plan",
            "slug": slug_base,
            "content": "This is a test content for the strategic plan.",
            "priority": "HIGH",
            "status": "DRAFT",
        }
        resp = requests.post(STRATEGIC_PLAN_URL, json=payload, cookies=session_cookies, headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 201, f"Expected 201 on creation but got {resp.status_code}"
        created_plan = resp.json()
        created_plan_id = created_plan.get("id") or created_plan.get("_id") or created_plan.get("ID") or created_plan.get("planId")
        assert created_plan_id, "Created plan ID not found in response"

        # 3) Try to create another strategic plan with the same slug (slug uniqueness enforcement)
        payload_duplicate_slug = {
            "title": "Test Strategic Plan Duplicate",
            "slug": slug_base,
            "content": "Duplicate slug content.",
            "priority": "LOW",
            "status": "DRAFT",
        }
        resp_dup = requests.post(STRATEGIC_PLAN_URL, json=payload_duplicate_slug, cookies=session_cookies, headers=headers, timeout=TIMEOUT)
        # Expect failure status code 400 or 409 or 422 for slug uniqueness violation
        assert resp_dup.status_code in (400, 409, 422), f"Expected 400, 409 or 422 for duplicate slug but got {resp_dup.status_code}"

        dup_json = resp_dup.json()
        error_message = str(dup_json).lower()
        assert "slug" in error_message, "Error message should mention 'slug' for uniqueness violation"

        # 4) Create a second plan with a different unique slug to confirm no error
        slug_unique = f"{slug_base}-unique"
        payload2 = {
            "title": "Test Strategic Plan 2",
            "slug": slug_unique,
            "content": "Another test content for unique slug.",
            "priority": "MEDIUM",
            "status": "UNDER_REVIEW",
        }
        resp2 = requests.post(STRATEGIC_PLAN_URL, json=payload2, cookies=session_cookies, headers=headers, timeout=TIMEOUT)
        assert resp2.status_code == 201, f"Expected 201 on creation of unique slug but got {resp2.status_code}"
        created_plan_2 = resp2.json()
        created_plan_id_2 = created_plan_2.get("id") or created_plan_2.get("_id") or created_plan_2.get("ID") or created_plan_2.get("planId")

    finally:
        # Cleanup created plans
        delete_plan(created_plan_id)
        if 'created_plan_id_2' in locals():
            delete_plan(created_plan_id_2)


test_admin_create_strategic_plan_with_validation_and_slug_uniqueness()
