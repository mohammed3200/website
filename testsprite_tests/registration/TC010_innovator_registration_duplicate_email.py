import requests
import uuid

BASE_URL = "http://localhost:3000/api/innovators"
TIMEOUT = 30

def test_innovator_registration_duplicate_email():
    unique = uuid.uuid4().hex[:8]
    shared_email = f"dup-inno-{unique}@example.com"

    form_data_1 = {
        "name": f"Innovator A {unique}",
        "email": shared_email,
        "phoneNumber": f"+1111{unique[:6]}",
        "country": "USA",
        "city": "Boston",
        "specialization": "ML",
        "projectTitle": "Project A",
        "projectDescription": "Description A",
        "TermsOfUse": "true"
    }

    # First registration should succeed
    resp1 = requests.post(BASE_URL, data=form_data_1, timeout=TIMEOUT)
    assert resp1.status_code == 201, (
        f"First registration expected 201, got {resp1.status_code}. Body: {resp1.text}"
    )

    # Second registration with same email should fail
    form_data_2 = {
        "name": f"Innovator B {unique}",
        "email": shared_email,
        "phoneNumber": f"+2222{unique[:6]}",
        "country": "UK",
        "city": "London",
        "specialization": "Data Science",
        "projectTitle": "Project B",
        "projectDescription": "Description B",
        "TermsOfUse": "true"
    }

    resp2 = requests.post(BASE_URL, data=form_data_2, timeout=TIMEOUT)
    assert resp2.status_code == 400, (
        f"Duplicate email expected 400, got {resp2.status_code}. Body: {resp2.text}"
    )

    body = resp2.json()
    assert body.get("code") == "EMAIL_EXISTS", (
        f"Expected code 'EMAIL_EXISTS', got: {body}"
    )

def run():
    test_innovator_registration_duplicate_email()

run()
