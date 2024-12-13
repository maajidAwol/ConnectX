import uuid
from django.db import models

# Comment out Product import for now
# from products.models import Product
# Comment out Order import for now
# from orders.models import Order


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('sale', 'Sale'),
        ('restock', 'Restock'),
        ('return', 'Return'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Temporarily commenting out the product ForeignKey
    # product = models.ForeignKey(Product, on_delete=models.CASCADE)
    
    # Temporary fields for testing
    product_name = models.CharField(max_length=255, default="Unknown Product", help_text="Enter the product name manually for testing.")
    product_price = models.DecimalField(
        max_digits=10, decimal_places=2, default=0.00, help_text="Enter the price of the product."
    )

    # Adding order_id as a ForeignKey (nullable for restocks)
    # Temporarily commenting out the order ForeignKey
    # order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True)

    order_id = models.CharField(max_length=32, default="demo_order_id", help_text="Order ID for sales and returns (restocks may not have this).")
    
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.product_name}"
