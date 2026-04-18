import requests

BASE_URL = "http://localhost:3000/api/innovators"
TIMEOUT = 30

def test_innovator_public_list():
    url = f"{BASE_URL}/public"
    try:
        response = requests.get(url, timeout=TIMEOUT)
        response.raise_for_status()
    except requests.RequestException as e:
        raise AssertionError(f"Request to GET /public failed: {e}") from e

    # Validate status code
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"

    # Validate response structure
    try:
        body = response.json()
    except ValueError as e:
        raise AssertionError(f"Response is not valid JSON: {e}") from e

    assert "data" in body, "Expected 'data' key in response"
    data = body["data"]
    assert isinstance(data, list), f"Expected data to be a list, got {type(data)}"

    # Each innovator should have required public fields
    for innovator in data:
        assert isinstance(innovator, dict), f"Each item should be a dict, got {type(innovator)}"
        assert "id" in innovator, "Missing 'id' field"
        assert "name" in innovator, "Missing 'name' field"
        assert "projectTitle" in innovator, "Missing 'projectTitle' field"
        assert "stageDevelopment" in innovator, "Missing 'stageDevelopment' field"

def run():
    test_innovator_public_list()

if __name__ == "__main__":
    run()
