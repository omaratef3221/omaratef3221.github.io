#!/usr/bin/env python3
"""
Test script for portfolio API endpoints
Run this to verify all endpoints are working correctly
"""

import requests
import json

BASE_URL = "http://localhost:5001/api"

def test_endpoint(method, endpoint, data=None, description=""):
    """Test a single API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    print(f"\n{'='*60}")
    print(f"Testing: {description}")
    print(f"Method: {method}")
    print(f"URL: {url}")
    print(f"{'='*60}")

    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        else:
            print(f"Unsupported method: {method}")
            return

        print(f"Status Code: {response.status_code}")
        print(f"Response:")
        print(json.dumps(response.json(), indent=2))

        if response.status_code == 200:
            print("✅ SUCCESS")
        else:
            print("❌ FAILED")

    except requests.exceptions.ConnectionError:
        print("❌ ERROR: Could not connect to server")
        print("Make sure the Flask server is running: python main.py")
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

def main():
    print("Portfolio API Test Suite")
    print("=" * 60)

    # Test Google Scholar endpoint
    test_endpoint(
        "GET",
        "/scholar/lw70gLkAAAAJ",
        description="Fetch Google Scholar profile data"
    )

    # Test GitHub profile endpoint
    test_endpoint(
        "GET",
        "/github/omaratef3221",
        description="Fetch GitHub profile and repositories"
    )

    # Test GitHub starred repos endpoint
    test_endpoint(
        "GET",
        "/github/omaratef3221/starred",
        description="Fetch GitHub starred repositories"
    )

    # Test contact form endpoint
    test_contact_data = {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Message",
        "message": "This is a test message from the API test script"
    }
    test_endpoint(
        "POST",
        "/contact",
        data=test_contact_data,
        description="Test contact form submission"
    )

    # Test cache status endpoint
    test_endpoint(
        "GET",
        "/cache/status",
        description="Check API cache status"
    )

    print("\n" + "=" * 60)
    print("Test suite completed!")
    print("=" * 60)

if __name__ == "__main__":
    main()
