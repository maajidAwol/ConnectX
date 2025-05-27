import os
import uuid
import cloudinary
import cloudinary.uploader
import tempfile
from typing import Optional, Dict, Union, Any
from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile

# Initialize Cloudinary
try:
    cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')
    api_key = os.environ.get('CLOUDINARY_API_KEY')
    api_secret = os.environ.get('CLOUDINARY_API_SECRET')
    
    if not all([cloud_name, api_key, api_secret]):
        print("WARNING: Missing Cloudinary credentials. Image upload will not work.")
        print(f"CLOUDINARY_CLOUD_NAME: {'Set' if cloud_name else 'Missing'}")
        print(f"CLOUDINARY_API_KEY: {'Set' if api_key else 'Missing'}")
        print(f"CLOUDINARY_API_SECRET: {'Set' if api_secret else 'Missing'}")
    
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )
    print("Cloudinary configured successfully.")
except Exception as e:
    print(f"ERROR initializing Cloudinary: {str(e)}")

def upload_image(
    image_file, 
    folder: str = 'general',
    public_id: Optional[str] = None,
    transformation: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Upload an image to Cloudinary
    
    Args:
        image_file: The image file to upload (from request.FILES)
        folder: The folder to upload to (e.g., 'products', 'users', etc.)
        public_id: Optional custom public ID for the image
        transformation: Optional transformation parameters
        
    Returns:
        Dictionary containing the upload response from Cloudinary
    """
    # Generate a unique ID if none provided
    if not public_id:
        public_id = f"{folder}/{uuid.uuid4()}"
    else:
        public_id = f"{folder}/{public_id}"
        
    # Default transformations
    default_transformation = {
        'quality': 'auto',
        'fetch_format': 'auto',
    }
    
    # Merge with custom transformations if provided
    if transformation:
        default_transformation.update(transformation)
    
    # Upload to Cloudinary
    try:
        # Handle different file types and create temp file if needed
        temp_file = None
        
        if isinstance(image_file, (InMemoryUploadedFile, TemporaryUploadedFile)):
            # Create a temp file to ensure we have a valid file to upload
            temp_file = tempfile.NamedTemporaryFile(delete=False)
            for chunk in image_file.chunks():
                temp_file.write(chunk)
            temp_file.close()
            
            # Use the temp file for upload
            upload_file = temp_file.name
        else:
            # Use the file directly
            upload_file = image_file
        
        # Perform the upload
        result = cloudinary.uploader.upload(
            upload_file,
            public_id=public_id,
            folder=folder,
            overwrite=True,
            resource_type="image",
            transformation=default_transformation
        )
        
        # Clean up temp file if created
        if temp_file:
            try:
                os.unlink(temp_file.name)
            except Exception:
                pass
                
        return {
            'success': True,
            'url': result['secure_url'],
            'public_id': result['public_id'],
            'data': result
        }
    except Exception as e:
        # Clean up temp file if created
        if temp_file:
            try:
                os.unlink(temp_file.name)
            except Exception:
                pass
                
        return {
            'success': False,
            'error': str(e)
        }

def delete_image(public_id: str) -> Dict[str, Any]:
    """
    Delete an image from Cloudinary
    
    Args:
        public_id: The public ID of the image to delete
        
    Returns:
        Dictionary containing the deletion response
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {
            'success': True,
            'result': result
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def generate_image_url(
    public_id: str, 
    transformation: Optional[Dict[str, Any]] = None
) -> str:
    """
    Generate a URL for an image with optional transformations
    
    Args:
        public_id: The public ID of the image
        transformation: Optional transformation parameters for Cloudinary
            This dictionary can include parameters like:
            - width, height: for resizing
            - crop: cropping mode (fill, fit, etc.)
            - effect: visual effects
            - quality: compression quality
            - format: output format (jpg, png, etc.)
            - overlay: for adding watermarks or text
        
    Returns:
        URL string for the transformed image
    
    Example:
        # Generate URL for a resized image (200x200, cropped to fill)
        url = generate_image_url('product_id', {
            'width': 200,
            'height': 200,
            'crop': 'fill'
        })
    """
    if not transformation:
        transformation = {}
    
    # This function uses Cloudinary's API to generate a URL for an image
    # with the specified transformations applied on-the-fly
    return cloudinary.CloudinaryImage(public_id).build_url(**transformation) 