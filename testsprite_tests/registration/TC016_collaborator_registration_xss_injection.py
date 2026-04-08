import requests
import uuid

BASE_URL = "http://localhost:3000/api/collaborator"
TIMEOUT = 30

def test_collaborator_registration_xss_injection():
    unique = uuid.uuid4().hex[:8]
    
    # XSS Payload
    xss_payload = "<script>alert('XSS')</script> Test Company"

    form_data = {
        "companyName": xss_payload,
        "email": f"xss-{unique}@example.com",
        "primaryPhoneNumber": f"+1234{unique[:6]}",
        "industrialSector": "Technology",
        "specialization": "Security",
    }

    resp = requests.post(BASE_URL, data=form_data, timeout=TIMEOUT)
    # The application should either sanitize it on input (returning 201 with sanitized data)
    # or reject it via validation (returning 400). It should NOT crash.
    assert resp.status_code in (201, 400), (
        f"Expected 201 (sanitized) or 400 (rejected) for XSS payload, got {resp.status_code}. Body: {resp.text}"
    )

def run():
    test_collaborator_registration_xss_injection()

run()
