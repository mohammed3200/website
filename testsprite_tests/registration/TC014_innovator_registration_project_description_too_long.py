import requests
import uuid

BASE_URL = "http://localhost:3000/api/innovators"
TIMEOUT = 30

def test_innovator_registration_project_description_too_long():
    unique = uuid.uuid4().hex[:8]

    # Max length is 1000
    desc_too_long = "D" * 1001

    form_data = {
        "name": f"Long Desc Inno {unique}",
        "email": f"longdesc-{unique}@example.com",
        "phoneNumber": f"+1234{unique[:6]}",
        "country": "USA",
        "city": "Chicago",
        "specialization": "Chemistry",
        "projectTitle": "Test Project",
        "projectDescription": desc_too_long,
        "TermsOfUse": "true"
    }

    resp = requests.post(BASE_URL, data=form_data, timeout=TIMEOUT)
    assert resp.status_code == 400, (
        f"Expected 400 for long project description, got {resp.status_code}. Body: {resp.text}"
    )

def run():
    test_innovator_registration_project_description_too_long()

run()
