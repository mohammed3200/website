import requests
import uuid

BASE_URL = "http://localhost:3000/api/collaborator"
TIMEOUT = 30

def test_collaborator_registration_happy_path():
    unique = uuid.uuid4().hex[:8]

    # Build multipart form data
    form_data = {
        "companyName": f"Test Company {unique}",
        "email": f"test-{unique}@example.com",
        "primaryPhoneNumber": f"+1234{unique[:6]}",
        "industrialSector": "Technology",
        "specialization": "Software Development",
        "location": "Riyadh, Saudi Arabia",
        "site": "https://example.com",
    }

    try:
        response = requests.post(BASE_URL, data=form_data, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to POST /api/collaborator failed: {e}"

    assert response.status_code == 201, (
        f"Expected 201 Created, got {response.status_code}. Body: {response.text}"
    )

    body = response.json()
    assert "message" in body, f"Expected 'message' in response, got: {body}"

def run():
    test_collaborator_registration_happy_path()

run()
