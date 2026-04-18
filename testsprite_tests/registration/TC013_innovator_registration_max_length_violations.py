import requests
import uuid

BASE_URL = "http://localhost:3000/api/innovators"
TIMEOUT = 30

def test_innovator_registration_max_length_violations():
    unique = uuid.uuid4().hex
    unique_phone = str(uuid.uuid4().int)[:10][:8]

    # Create strings that exceed limits
    city_too_long = "C" * 101 # Max is 100
    specialization_too_long = "S" * 201 # Max is 200

    form_data = {
        "name": f"Max Length Violator {unique}",
        "email": f"maxlen-{unique}@example.com",
        "phoneNumber": f"+1234{unique_phone[:6]}",
        "country": "USA",
        "city": city_too_long,
        "specialization": specialization_too_long,
        "projectTitle": "Test Project",
        "projectDescription": "Valid description",
        "TermsOfUse": "true"
    }

    resp = requests.post(BASE_URL, data=form_data, timeout=TIMEOUT)
    assert resp.status_code == 400, (
        f"Expected 400 for max length violations, got {resp.status_code}. Body: {resp.text}"
    )

def run():
    test_innovator_registration_max_length_violations()

run()
