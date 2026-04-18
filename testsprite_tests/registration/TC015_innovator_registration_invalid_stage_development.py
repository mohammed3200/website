import requests
import uuid

BASE_URL = "http://localhost:3000/api/innovators"
TIMEOUT = 30

def test_innovator_registration_invalid_stage_development():
    unique = uuid.uuid4().hex[:8]

    form_data = {
        "name": f"Bad Stage Inno {unique}",
        "email": f"badstage-{unique}@example.com",
        "phoneNumber": f"+1234{unique[:6]}",
        "country": "USA",
        "city": "Miami",
        "specialization": "Physics",
        "projectTitle": "Test Project",
        "projectDescription": "Valid description",
        "stageDevelopment": "NOT_A_VALID_STAGE", # Should be STAGE, PROTOTYPE, etc.
        "TermsOfUse": "true"
    }

    resp = requests.post(BASE_URL, data=form_data, timeout=TIMEOUT)
    # The server might fallback to a default if handling is loose, BUT the Zod schema requires it to be an enum if provided
    # Looking at the codebase, the Zod schema restricts it on the server if it's strictly validated
    assert resp.status_code == 400, (
        f"Expected 400 for invalid stage, got {resp.status_code}. Body: {resp.text}"
    )

def run():
    test_innovator_registration_invalid_stage_development()

run()
