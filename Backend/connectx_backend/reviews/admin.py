from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'rating', 'is_purchased', 'created_at')
    search_fields = ('user__email', 'product__name')
    list_filter = ('rating', 'is_purchased', 'created_at')
