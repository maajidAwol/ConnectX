from django.contrib import admin
from .models import OrderPayment, PaymentHistory


class PaymentHistoryInline(admin.TabularInline):
    model = PaymentHistory
    extra = 0
    readonly_fields = ['created_at']


@admin.register(OrderPayment)
class OrderPaymentAdmin(admin.ModelAdmin):
    list_display = ['order', 'tenant', 'payment_method', 'amount', 'status', 'created_at']
    list_filter = ['payment_method', 'status', 'tenant', 'created_at']
    search_fields = ['order__order_number', 'transaction_reference']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [PaymentHistoryInline]
    date_hierarchy = 'created_at'
    fieldsets = (
        ('Basic Information', {
            'fields': ('order', 'tenant', 'payment_method', 'status', 'created_at', 'updated_at')
        }),
        ('Financial Information', {
            'fields': ('amount',)
        }),
        ('Chapa Details', {
            'fields': ('transaction_reference', 'checkout_url'),
            'classes': ('collapse',),
        }),
        ('Additional Information', {
            'fields': ('notes',),
            'classes': ('collapse',),
        }),
    )


@admin.register(PaymentHistory)
class PaymentHistoryAdmin(admin.ModelAdmin):
    list_display = ['payment', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['payment__order__order_number', 'description']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
