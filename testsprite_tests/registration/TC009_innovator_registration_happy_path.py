import requests
import uuid

BASE_URL = "http://localhost:3000/api/innovators"
TIMEOUT = 30

def test_innovator_registration_happy_path():
    unique = uuid.uuid4().hex[:8]

    # Build multipart form data
    form_data = {
        "name": f"Test Innovator {unique}",
        "email": f"test-inno-{unique}@example.com",
        "phoneNumber": f"+1234{unique[:6]}",
        "country": "USA",
        "city": "New York",
        "specialization": "Artificial Intelligence",
        "projectTitle": f"AI Project {unique}",
        "projectDescription": "This is a detailed description of the AI project.",
        "TermsOfUse": "true"
    }

    try:
        response = requests.post(BASE_URL, data=form_data, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to POST /api/innovators failed: {e}"

    assert response.status_code == 201, (
        f"Expected 201 Created, got {response.status_code}. Body: {response.text}"
    )

    body = response.json()
    assert "message" in body or body.get("success"), f"Expected success indication in response, got: {body}"

def run():
    test_innovator_registration_happy_path()

run()
