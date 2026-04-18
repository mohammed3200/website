import requests
import uuid

BASE_URL = "http://localhost:3000/api/collaborator"
TIMEOUT = 30

def test_collaborator_registration_duplicate_phone():
    unique = uuid.uuid4().hex
    unique_phone = str(uuid.uuid4().int)[:10][:8]
    shared_phone = f"+9999{unique_phone[:6]}"

    form_data_1 = {
        "companyName": f"PhoneCo A {unique}",
        "email": f"phonea-{unique}@example.com",
        "primaryPhoneNumber": shared_phone,
        "industrialSector": "Technology",
        "specialization": "IoT",
    }

    resp1 = requests.post(BASE_URL, data=form_data_1, timeout=TIMEOUT)
    assert resp1.status_code == 201, (
        f"First registration expected 201, got {resp1.status_code}. Body: {resp1.text}"
    )

    form_data_2 = {
        "companyName": f"PhoneCo B {unique}",
        "email": f"phoneb-{unique}@example.com",
        "primaryPhoneNumber": shared_phone,
        "industrialSector": "Technology",
        "specialization": "Robotics",
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
    test_collaborator_registration_duplicate_phone()

run()
