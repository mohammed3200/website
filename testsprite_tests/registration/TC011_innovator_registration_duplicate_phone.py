import requests
import uuid

BASE_URL = "http://localhost:3000/api/innovators"
TIMEOUT = 30

def test_innovator_registration_duplicate_phone():
    unique = uuid.uuid4().hex[:8]
    shared_phone = f"+9999{unique[:6]}"

    form_data_1 = {
        "name": f"Phone Inno A {unique}",
        "email": f"phonea-{unique}@example.com",
        "phoneNumber": shared_phone,
        "country": "USA",
        "city": "Seattle",
        "specialization": "Cloud",
        "projectTitle": "Project Cloud",
        "projectDescription": "Cloud tech description",
        "TermsOfUse": "true"
    }

    resp1 = requests.post(BASE_URL, data=form_data_1, timeout=TIMEOUT)
    assert resp1.status_code == 201, (
        f"First registration expected 201, got {resp1.status_code}. Body: {resp1.text}"
    )

    form_data_2 = {
        "name": f"Phone Inno B {unique}",
        "email": f"phoneb-{unique}@example.com",
        "phoneNumber": shared_phone,
        "country": "USA",
        "city": "Austin",
        "specialization": "DevOps",
        "projectTitle": "Project DevOps",
        "projectDescription": "DevOps tech description",
        "TermsOfUse": "true"
    }

    resp2 = requests.post(BASE_URL, data=form_data_2, timeout=TIMEOUT)
    assert resp2.status_code == 400, (
        f"Duplicate phone expected 400, got {resp2.status_code}. Body: {resp2.text}"
    )

    body = resp2.json()
    assert body.get("code") == "PHONE_EXISTS", (
        f"Expected code 'PHONE_EXISTS', got: {body}"
    )

def run():
    test_innovator_registration_duplicate_phone()

run()
