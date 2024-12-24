from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'order', 'transaction_type', 'payment_status', 'timestamp')
    list_filter = ('transaction_type', 'payment_status', 'timestamp')
    search_fields = ('order_id',)
    ordering = ('-timestamp',)
    readonly_fields = ('timestamp',)
