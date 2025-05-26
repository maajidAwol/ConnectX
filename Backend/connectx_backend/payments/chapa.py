import requests
from django.conf import settings
from typing import Dict, Any, Optional
import json
import hmac
import hashlib

# Chapa API Configuration
CHAPA_AUTH_KEY = "CHASECK_TEST-3bTAj1IjcC4lIu11VrNq9gTmVys659FA"  # Test Secret Key
CHAPA_PUBLIC_KEY = "CHAPUBK_TEST-vPyKZqPWCT6EPYB1wPZ6QvPuJSpBrU"  # Test Public Key
CHAPA_API_BASE_URL = "https://api.chapa.co/v1"

# Hardcoded webhook secret for demo (use environment variable in production)
CHAPA_WEBHOOK_SECRET_DEMO = "ConnectX_Demo_Webhook_Secret_2024_abc123def456"

class ChapaError(Exception):
    """Custom exception for Chapa API errors"""
    pass

class ChapaPayment:
    @staticmethod
    def initialize_payment(
        amount: float,
        currency: str,
        email: str,
        first_name: str,
        last_name: str,
        tx_ref: str,
        callback_url: str,
        return_url: str,
        customization: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Initialize a payment transaction with Chapa.
        
        Args:
            amount: The payment amount
            currency: The currency code (e.g., 'ETB')
            email: Customer's email
            first_name: Customer's first name
            last_name: Customer's last name
            tx_ref: Unique transaction reference
            callback_url: Webhook URL for payment notifications
            return_url: URL to redirect after payment
            customization: Optional customization parameters
        
        Returns:
            Dict containing the Chapa response with checkout URL
            
        Raises:
            ChapaError: If the API request fails
        """
        headers = {
            "Authorization": f"Bearer {CHAPA_AUTH_KEY}",
            "Content-Type": "application/json",
            "X-Chapa-Test-Mode": "true"  # Add test mode header
        }
        
        # Prepare the base payload
        payload = {
            "amount": str(amount),
            "currency": currency,
            "email": email,
            "first_name": first_name,
            "last_name": last_name,
            "tx_ref": tx_ref,
            "callback_url": callback_url,
            "return_url": return_url,
            "public_key": CHAPA_PUBLIC_KEY  # Add public key to payload
        }
        
        # Add customization if provided
        if customization:
            if "phone_number" in customization:
                # Ensure phone number is in correct format (09xxxxxxxx or 07xxxxxxxx)
                phone = str(customization["phone_number"])
                if phone.startswith('+251'):
                    phone = '0' + phone[4:]
                elif phone.startswith('251'):
                    phone = '0' + phone[3:]
                payload["phone_number"] = phone
                
            if "title" in customization:
                # Ensure title is within 16 characters and contains only allowed characters
                title = ''.join(c for c in customization["title"][:16] if c.isalnum() or c.isspace())
                description = ''.join(c for c in customization.get("description", "")[:100] if c.isalnum() or c.isspace())
                payload["customization"] = {
                    "title": title,
                    "description": description
                }
        
        try:
            print(f"Chapa API Request Payload: {json.dumps(payload, indent=2)}")  # Debug log
            response = requests.post(
                f"{CHAPA_API_BASE_URL}/transaction/initialize",
                headers=headers,
                json=payload
            )
            print(f"Chapa API Response Status: {response.status_code}")  # Debug log
            print(f"Chapa API Response Headers: {dict(response.headers)}")  # Debug log
            print(f"Chapa API Response Body: {response.text}")  # Debug log
            
            # Check if the request was successful
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "success":
                    return {
                        "status": "success",
                        "message": data.get("message", "Payment initialized successfully"),
                        "data": {
                            "checkout_url": data["data"]["checkout_url"],
                            "tx_ref": tx_ref
                        }
                    }
                else:
                    print(f"Chapa API Error Response: {data}")  # Debug log
                    raise ChapaError(data.get("message", "Payment initialization failed"))
            else:
                error_msg = "Unknown error"
                try:
                    error_data = response.json()
                    print(f"Chapa API Error Response (Status {response.status_code}): {error_data}")  # Debug log
                    error_msg = error_data.get("message", error_msg)
                except:
                    print(f"Chapa API Raw Response: {response.text}")  # Debug log
                    error_msg = response.text
                raise ChapaError(f"Payment initialization failed: {error_msg}")
                
        except requests.exceptions.RequestException as e:
            print(f"Chapa API Request Error: {str(e)}")  # Debug log
            raise ChapaError(f"Failed to connect to Chapa API: {str(e)}")

    @staticmethod
    def verify_payment(tx_ref: str) -> Dict[str, Any]:
        """
        Verify a payment transaction with Chapa.
        
        Args:
            tx_ref: The transaction reference to verify
            
        Returns:
            Dict containing the verification response
            
        Raises:
            ChapaError: If verification fails
        """
        headers = {
            "Authorization": f"Bearer {CHAPA_AUTH_KEY}",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.get(
                f"{CHAPA_API_BASE_URL}/transaction/verify/{tx_ref}",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "success":
                    return data
                else:
                    raise ChapaError(data.get("message", "Payment verification failed"))
            else:
                error_msg = "Unknown error"
                try:
                    error_data = response.json()
                    error_msg = error_data.get("message", error_msg)
                except:
                    error_msg = response.text
                raise ChapaError(f"Payment verification failed: {error_msg}")
                
        except requests.exceptions.RequestException as e:
            raise ChapaError(f"Failed to connect to Chapa API: {str(e)}")

    @staticmethod
    def generate_checkout_url(checkout_data: Dict[str, Any]) -> str:
        """
        Generate a Chapa checkout URL from the initialization response.
        
        Args:
            checkout_data: The response data from initialize_payment
            
        Returns:
            str: The checkout URL
        """
        try:
            return checkout_data['data']['checkout_url']
        except (KeyError, TypeError):
            raise Exception("Invalid checkout data format")

    @staticmethod
    def verify_webhook_signature(payload: str, signature: str, secret_key: str) -> bool:
        """
        Verify webhook signature from Chapa.
        
        Args:
            payload: The raw webhook payload as string
            signature: The signature from Chapa-Signature or x-chapa-signature header
            secret_key: Your webhook secret key
            
        Returns:
            bool: True if signature is valid, False otherwise
        """
        try:
            # Create HMAC SHA256 hash of the payload using the secret key
            expected_signature = hmac.new(
                secret_key.encode('utf-8'),
                payload.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            
            # Compare signatures (constant time comparison to prevent timing attacks)
            return hmac.compare_digest(expected_signature, signature)
        except Exception as e:
            print(f"Webhook signature verification error: {str(e)}")
            return False
    
    @staticmethod
    def verify_webhook_request(request, secret_key: str) -> bool:
        """
        Verify webhook request from Chapa using either Chapa-Signature or x-chapa-signature header.
        
        Args:
            request: Django request object
            secret_key: Your webhook secret key
            
        Returns:
            bool: True if request is valid, False otherwise
        """
        try:
            # Get the raw body as string
            if hasattr(request, 'body'):
                payload = request.body.decode('utf-8')
            else:
                payload = json.dumps(request.data)
            
            # Check for Chapa-Signature header
            chapa_signature = request.META.get('HTTP_CHAPA_SIGNATURE')
            x_chapa_signature = request.META.get('HTTP_X_CHAPA_SIGNATURE')
            
            # Verify using either signature (at least one must be valid)
            if chapa_signature:
                if ChapaPayment.verify_webhook_signature(payload, chapa_signature, secret_key):
                    return True
            
            if x_chapa_signature:
                if ChapaPayment.verify_webhook_signature(payload, x_chapa_signature, secret_key):
                    return True
            
            print("No valid webhook signature found")
            return False
            
        except Exception as e:
            print(f"Webhook verification error: {str(e)}")
            return False 