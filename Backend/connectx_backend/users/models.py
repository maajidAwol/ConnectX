from django.db import models

class User(models.Model):
    ADMIN = 'admin'
    ENTREPRENEUR = 'entrepreneur'
    CUSTOMER = 'customer'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (ENTREPRENEUR, 'Entrepreneur'),
        (CUSTOMER, 'Customer'),
    ]
    
    user_id = models.AutoField(primary_key=True)  
    name = models.CharField(max_length=255)  
    email = models.EmailField(unique=True) 
    password_hash = models.TextField()  
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default=CUSTOMER)  
    created_at = models.DateTimeField(auto_now_add=True) 
    last_login = models.DateTimeField(null=True, blank=True)  

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'users'  # Custom table name
