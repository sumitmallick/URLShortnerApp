import secrets
import string

ALPHABET = string.ascii_letters + string.digits

def generate_code(length=8):
    """Generate a secure random code of given length."""
    return ''.join(secrets.choice(ALPHABET) for _ in range(length))
