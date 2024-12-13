# from django.contrib import admin
# from .models import Transaction

# @admin.register(Transaction)
# class TransactionAdmin(admin.ModelAdmin):
#     list_display = ('id', 'product', 'transaction_type', 'quantity', 'timestamp')
#     list_filter = ('transaction_type', 'timestamp')
#     search_fields = ('product__name', 'transaction_type')
#     ordering = ('-timestamp',)

from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    # Show temporary fields in admin
    list_display = ('id', 'product_name', 'product_price', 'order_id', 'transaction_type', 'quantity', 'timestamp')
    list_filter = ('transaction_type', 'timestamp')
    search_fields = ('product_name', 'transaction_type', 'order_id')  # Add order_id for search
    ordering = ('-timestamp',)
    fields = ('product_name', 'product_price', 'order_id', 'transaction_type', 'quantity', 'timestamp')  # Add order_id to fields
    readonly_fields = ('timestamp',)
