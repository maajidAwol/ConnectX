from django.db import models
from products.models import Product

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('sale', 'Sale'),
        ('restock', 'Restock'),
        ('return', 'Return'),
    ]
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    quantity = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_transaction_type_display()} - {self.product.name}"
