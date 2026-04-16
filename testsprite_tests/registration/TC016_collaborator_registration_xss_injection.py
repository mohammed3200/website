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
    # The application should sanitize it on input and return 201 with sanitized data
    assert resp.status_code == 201, (
        f"Expected 201 (sanitized) for XSS payload, got {resp.status_code}. Body: {resp.text}"
    )

    result_data = resp.json().get("data", {})
    sanitized_name = result_data.get("companyName", "")

    # Check for raw script tags or common XSS tokens
    forbidden_tokens = ["<script>", "alert(", "onload="]
    for token in forbidden_tokens:
        assert token not in sanitized_name, (
            f"XSS Injection Token '{token}' found in sanitized output: {sanitized_name}"
        )
    
    print(f"Sanitization verified for: {sanitized_name}")

def run():
    test_collaborator_registration_xss_injection()

run()
