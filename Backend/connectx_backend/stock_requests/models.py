from django.db import models
from users.models import User
from products.models import Product

class StockRequest(models.Model):
    entrepreneur = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'entrepreneur'})
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    requested_quantity = models.IntegerField()
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
