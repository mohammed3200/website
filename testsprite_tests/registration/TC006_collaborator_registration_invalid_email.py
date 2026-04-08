import requests

BASE_URL = "http://localhost:3000/api/collaborator"
TIMEOUT = 30

def test_collaborator_registration_invalid_email():
    form_data = {
        "companyName": "Invalid Email Co",
        "email": "not-an-email",
        "primaryPhoneNumber": "+1234567890",
        "industrialSector": "Technology",
        "specialization": "Testing",
    }

    resp = requests.post(BASE_URL, data=form_data, timeout=TIMEOUT)
    assert resp.status_code == 400, (
        f"Expected 400 for invalid email, got {resp.status_code}. Body: {resp.text}"
    )

def run():
    test_collaborator_registration_invalid_email()

run()
