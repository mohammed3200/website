import requests
import uuid

BASE_URL = "http://localhost:3000/api/innovators"
TIMEOUT = 30

def test_innovator_registration_sql_injection():
    unique = uuid.uuid4().hex[:8]

    # Basic SQL Injection payload
    sqli_payload = "test' OR '1'='1"

    form_data = {
        "name": sqli_payload,
        "email": f"sqli-{unique}@example.com",
        "phoneNumber": f"+1234{unique[:6]}",
        "country": "USA",
        "city": "Dallas",
        "specialization": "Security",
        "projectTitle": "Test Project",
        "projectDescription": "Valid description",
        "TermsOfUse": "true"
    }

    resp = requests.post(BASE_URL, data=form_data, timeout=TIMEOUT)
    
    # Prisma prevents SQL injection natively. The request should succeed 
    # (treating the payload as a literal string) or be rejected by validation.
    # It must NOT return a 500 database error.
    assert resp.status_code in (201, 400), (
        f"Expected 201 or 400 for SQLi payload, got {resp.status_code}. Body: {resp.text}"
    )

def run():
    test_innovator_registration_sql_injection()

run()
