import requests

BASE_URL = "http://localhost:3000/api/collaborator"
TIMEOUT = 30

def test_collaborator_registration_invalid_phone():
    form_data = {
        "companyName": "Bad Phone Co",
        "email": "badphone@example.com",
        "primaryPhoneNumber": "12345",  # Missing + prefix, too short
        "industrialSector": "Technology",
        "specialization": "Testing",
    }

    resp = requests.post(BASE_URL, data=form_data, timeout=TIMEOUT)
    assert resp.status_code == 400, (
        f"Expected 400 for invalid phone, got {resp.status_code}. Body: {resp.text}"
    )

def run():
    test_collaborator_registration_invalid_phone()

if __name__ == "__main__":
    run()
