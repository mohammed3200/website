import requests
import uuid

BASE_URL = "http://localhost:3000/api/collaborator"
TIMEOUT = 30

def test_collaborator_registration_arabic_unicode():
    unique = uuid.uuid4().hex[:8]

    form_data = {
        "companyName": f"الشركة العربية {unique}",
        "email": f"arabic-{unique}@example.com",
        "primaryPhoneNumber": f"+9665{unique[:6]}",
        "industrialSector": "Technology",
        "specialization": "برمجة",
        "location": "الرياض، المملكة العربية السعودية",
    }

    resp = requests.post(BASE_URL, data=form_data, timeout=TIMEOUT)
    assert resp.status_code == 201, (
        f"Expected 201 Created for Arabic text, got {resp.status_code}. Body: {resp.text}"
    )

    result_data = resp.json().get("data", {})
    
    # Verify Unicode preservation
    for field in ["companyName", "specialization", "location"]:
        expected = form_data[field]
        actual = result_data.get(field)
        assert expected == actual, (
            f"Unicode data mismatch for field '{field}': Expected '{expected}', got '{actual}'"
        )
    
    print("Arabic Unicode integrity verified.")

def run():
    test_collaborator_registration_arabic_unicode()

run()
