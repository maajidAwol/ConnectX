import uuid
from django.db import models
from django.contrib.auth.hashers import make_password

class User(models.Model):
    ADMIN = 'admin'
    ENTREPRENEUR = 'entrepreneur'
    CUSTOMER = 'customer'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (ENTREPRENEUR, 'Entrepreneur'),
        (CUSTOMER, 'Customer'),
    ]
    
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)  
    name = models.CharField(max_length=255)  
    email = models.EmailField(unique=True) 
    password_hash = models.TextField()  
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default=CUSTOMER)  
    created_at = models.DateTimeField(auto_now_add=True) 
    last_login = models.DateTimeField(null=True, blank=True)  

    def save(self, *args, **kwargs):
        # Hash the password before saving
        self.password_hash = make_password(self.password_hash)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'users'  