from django.contrib import admin
from .models import Category, Product

# Register Category model
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Register Product model
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock_quantity', 'seller', 'is_active')
    list_filter = ('category', 'is_active', 'shared_inventory')
    search_fields = ('name', 'description', 'seller__username')
    readonly_fields = ('product_id', 'created_at')


