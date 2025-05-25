from django.db import models
import uuid
from tenants.models import Tenant
from users.models import User
from products.models import Product
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name="reviews")
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="reviews"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    title = models.CharField(max_length=200, blank=True, default="")  # Optional title for the review
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    is_purchased = models.BooleanField(
        default=False
    )  # Ensure the user actually bought the product
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (
            "tenant",
            "user",
            "product",
        )  # One review per user per product
        ordering = ["-created_at"]

    def clean(self):
        """Validate the review data."""
        if not self.is_purchased:
            raise ValidationError("You must purchase the product before reviewing it.")
        if self.rating < 1 or self.rating > 5:
            raise ValidationError("Rating must be between 1 and 5.")

    def save(self, *args, **kwargs):
        """Ensure validation is called before saving."""
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        title_part = f"'{self.title}' " if self.title else ""
        return f"Review {title_part}by {self.user.email} for {self.product.name} ({self.rating}/5)"
