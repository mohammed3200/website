import requests

BASE_URL = "http://localhost:3000/api/collaborator"
TIMEOUT = 30

def test_collaborator_public_list():
    url = f"{BASE_URL}/public"
    try:
        response = requests.get(url, timeout=TIMEOUT)
        response.raise_for_status()
    except requests.RequestException as e:
        assert False, f"Request to GET /public failed: {e}"

    # Validate status code
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"

    # Validate response structure
    try:
        body = response.json()
    except Exception as e:
        assert False, f"Response is not valid JSON: {e}"

    assert "data" in body, "Expected 'data' key in response"
    data = body["data"]
    assert isinstance(data, list), f"Expected data to be a list, got {type(data)}"

    # Each collaborator should have required public fields
    for collab in data:
        assert isinstance(collab, dict), f"Each item should be a dict, got {type(collab)}"
        assert "id" in collab, "Missing 'id' field"
        assert "companyName" in collab, "Missing 'companyName' field"
        assert "industrialSector" in collab, "Missing 'industrialSector' field"

def run():
    test_collaborator_public_list()

run()
