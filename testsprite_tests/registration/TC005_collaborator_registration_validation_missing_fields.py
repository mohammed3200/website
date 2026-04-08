import requests

BASE_URL = "http://localhost:3000/api/collaborator"
TIMEOUT = 30

def test_collaborator_registration_validation_missing_fields():
    """Send POST with empty form data - should fail validation (400)."""

    # Completely empty
    resp = requests.post(BASE_URL, data={}, timeout=TIMEOUT)
    assert resp.status_code == 400, (
        f"Expected 400 for empty form, got {resp.status_code}. Body: {resp.text}"
    )

    # Missing just industrialSector (required enum)
    partial = {
        "companyName": "Partial Co",
        "email": "partial@example.com",
        "primaryPhoneNumber": "+1234567890",
        "specialization": "Something",
    }
    resp2 = requests.post(BASE_URL, data=partial, timeout=TIMEOUT)
    assert resp2.status_code == 400, (
        f"Expected 400 for missing industrialSector, got {resp2.status_code}. Body: {resp2.text}"
    )

def run():
    test_collaborator_registration_validation_missing_fields()

run()
