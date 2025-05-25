import string
import random
from datetime import datetime


def generate_sku(tenant_name, category_name):
    """
    Generate a unique SKU for a product.
    Format: TENANT-CATEGORY-YYYYMMDD-XXXXX
    Where:
    - TENANT: First 3 letters of tenant name (uppercase)
    - CATEGORY: First 3 letters of category name (uppercase)
    - YYYYMMDD: Current date
    - XXXXX: Random 5 characters (alphanumeric)
    """
    # Get tenant prefix (first 3 letters, uppercase)
    tenant_prefix = tenant_name[:3].upper()

    # Get category prefix (first 3 letters, uppercase)
    category_prefix = category_name[:3].upper()

    # Get current date in YYYYMMDD format
    date_prefix = datetime.now().strftime("%Y%m%d")

    # Generate random 5 characters
    random_suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=5))

    # Combine all parts
    sku = f"{tenant_prefix}-{category_prefix}-{date_prefix}-{random_suffix}"

    return sku
