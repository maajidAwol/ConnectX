from django.db import models
import uuid
from tenants.models import Tenant
from users.models import User
from products.models import Product

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="reviews")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField()  # 1-5 star rating
    comment = models.TextField()
    is_purchased = models.BooleanField(default=False)  # Ensure the user actually bought the product
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'product')  # One review per user per product

    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.rating} ⭐)"
