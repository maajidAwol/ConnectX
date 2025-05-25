from django.core.mail import send_mail
from django.conf import settings
from .jwt_utils import generate_email_verification_token, generate_password_reset_token


def send_verification_email(user, frontEndUrl=settings.FRONTEND_URL) -> bool:
    """
    Send an email verification link to the user.

    Args:
        user: The user instance to send the verification email to

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    token = generate_email_verification_token(str(user.id), user.email)
    verification_url = f"{frontEndUrl}/verify-email?token={token}"

    subject = "Verify your email address"
    message = f"""
    Hello {user.name or user.username},
    
    Please click the link below to verify your email address:
    {verification_url}
    
    This link will expire in 1 hour.
    
    If you did not request this verification, please ignore this email.
    
    Best regards,
    {settings.SITE_NAME}
    """

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return True
    except Exception:
        return False


def send_password_reset_email(user) -> bool:
    """
    Send a password reset link to the user.

    Args:
        user: The user instance to send the password reset email to

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    token = generate_password_reset_token(str(user.id), user.email)
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    subject = "Reset your password"
    message = f"""
    Hello {user.name or user.username},

    Please click the link below to reset your password:
    {reset_url}

    This link will expire in 1 hour.

    If you did not request this, please ignore this email.

    Best regards,
    {settings.SITE_NAME}
    """

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        return True
    except Exception:
        return False
