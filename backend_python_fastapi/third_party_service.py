import json
import uuid
import os
from datetime import datetime

API_KEYS_FILE = "api_keys.json"


def load_keys() -> dict:
    """Read all API keys from JSON file"""
    if not os.path.exists(API_KEYS_FILE) or os.stat(API_KEYS_FILE).st_size == 0:
        return {}
    try:
        with open(API_KEYS_FILE, "r") as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}


def save_keys(data: dict):
    """Write all API keys to JSON file"""
    with open(API_KEYS_FILE, "w") as f:
        json.dump(data, f, indent=2)


def generate_api_key() -> str:
    """Generate a unique API key"""
    return f"cvfy_{uuid.uuid4().hex}"


def get_key_data(api_key: str) -> dict | None:
    """Get details for a specific API key"""
    keys = load_keys()
    return keys.get(api_key, None)


def create_api_key(email: str, initial_credits: int = 0) -> str:
    """Create a new API key for a third party"""
    keys = load_keys()
    api_key = generate_api_key()
    keys[api_key] = {
        "email": email,
        "credits": initial_credits,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat()
    }
    save_keys(keys)
    return api_key


def deduct_credit(api_key: str) -> bool:
    """
    Deduct one credit from API key.
    Returns True if successful, False if no credits left.
    """
    keys = load_keys()
    if api_key not in keys:
        return False
    if keys[api_key]["credits"] <= 0:
        return False
    keys[api_key]["credits"] -= 1
    save_keys(keys)
    return True


def add_credits(api_key: str, amount: int):
    """Add credits to an API key after payment"""
    keys = load_keys()
    if api_key in keys:
        keys[api_key]["credits"] += amount
        save_keys(keys)


def is_key_valid(api_key: str) -> bool:
    """Check if API key exists and is active"""
    data = get_key_data(api_key)
    if not data:
        return False
    return data.get("is_active", False)


def has_credits(api_key: str) -> bool:
    """Check if API key has credits remaining"""
    data = get_key_data(api_key)
    if not data:
        return False
    return data.get("credits", 0) > 0


def get_credits_balance(api_key: str) -> int:
    """Get remaining credits for an API key"""
    data = get_key_data(api_key)
    if not data:
        return 0
    return data.get("credits", 0)