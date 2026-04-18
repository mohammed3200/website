import requests

BASE_URL = "http://localhost:3000/api/innovators"
TIMEOUT = 30

def test_innovator_registration_validation_missing_fields():
    """Send POST with empty form data - should fail validation (400)."""

    # Completely empty
    resp = requests.post(BASE_URL, data={}, timeout=TIMEOUT)
    assert resp.status_code == 400, (
        f"Expected 400 for empty form, got {resp.status_code}. Body: {resp.text}"
    )

    # Missing required text field (projectTitle) but providing TermsOfUse
    partial = {
        "name": "Missing Project Title",
        "email": "missing-title@example.com",
        "phoneNumber": "+1234567890",
        "TermsOfUse": "true", # Correctly provided
        # projectTitle is omitted -> should still fail 400
    }
    resp2 = requests.post(BASE_URL, data=partial, timeout=TIMEOUT)
    assert resp2.status_code == 400, (
        f"Expected 400 for missing projectTitle, got {resp2.status_code}. Body: {resp2.text}"
    )

def run():
    test_innovator_registration_validation_missing_fields()

run()
