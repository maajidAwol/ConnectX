import jwt
from datetime import datetime, timedelta
from django.conf import settings
from typing import Dict, Any, Optional


def generate_email_verification_token(user_id: str, email: str) -> str:
    """
    Generate a JWT token for email verification.

    Args:
        user_id: The ID of the user to verify
        email: The email address to verify

    Returns:
        str: The encoded JWT token
    """
    payload = {
        "user_id": user_id,
        "email": email,
        "type": "email_verification",
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=1),
    }

    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def decode_email_verification_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and verify an email verification token.

    Args:
        token: The JWT token to decode

    Returns:
        Optional[Dict[str, Any]]: The decoded token payload if valid, None otherwise

    Raises:
        jwt.ExpiredSignatureError: If the token has expired
        jwt.InvalidTokenError: If the token is invalid
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])

        # Verify token type
        if payload.get("type") != "email_verification":
            return None

        return payload
    except jwt.InvalidTokenError:
        return None


def generate_password_reset_token(user_id: str, email: str) -> str:
    """
    Generate a JWT token for password reset.

    Args:
        user_id: The ID of the user for password reset
        email: The email address of the user

    Returns:
        str: The encoded JWT token
    """
    payload = {
        "user_id": user_id,
        "email": email,
        "type": "password_reset",
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=1),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def decode_password_reset_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and verify a password reset token.

    Args:
        token: The JWT token to decode

    Returns:
        Optional[Dict[str, Any]]: The decoded token payload if valid, None otherwise

    Raises:
        jwt.ExpiredSignatureError: If the token has expired
        jwt.InvalidTokenError: If the token is invalid
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        if payload.get("type") != "password_reset":
            return None
        return payload
    except jwt.InvalidTokenError:
        return None
