import requests
import uuid

BASE_URL = "http://localhost:3000/api/collaborator"
TIMEOUT = 30

def test_collaborator_registration_happy_path():
    unique = uuid.uuid4().hex
    unique_phone = str(uuid.uuid4().int)[:10][:8]

    # Build multipart form data
    form_data = {
        "companyName": f"Test Company {unique}",
        "email": f"test-{unique}@example.com",
        "primaryPhoneNumber": f"+1234{unique_phone[:6]}",
        "industrialSector": "Technology",
        "specialization": "Software Development",
        "location": "Riyadh, Saudi Arabia",
        "site": "https://example.com",
        "TermsOfUse": "true" # Required field
    }

    try:
        response = requests.post(BASE_URL, data=form_data, timeout=TIMEOUT)
    except requests.RequestException as e:
        raise AssertionError(f"Request to POST /api/collaborator failed: {e}") from e

    assert response.status_code == 201, (
        f"Expected 201 Created, got {response.status_code}. Body: {response.text}"
    )

    body = response.json()
    assert "message" in body, f"Expected 'message' in response, got: {body}"
    assert "data" in body, f"Expected 'data' object in response, got: {body}"
    
    data = body["data"]
    assert data.get("id"), "Response data missing 'id'"
    assert data.get("email") == form_data["email"], f"Email mismatch: {data.get('email')}"
    assert data.get("companyName") == form_data["companyName"], f"Company name mismatch: {data.get('companyName')}"

def run():
    test_collaborator_registration_happy_path()

if __name__ == "__main__":
    run()
