from django.contrib import admin
from .models import Payment, PaymentHistory


class PaymentHistoryInline(admin.TabularInline):
    model = PaymentHistory
    extra = 0
    readonly_fields = ['created_at']
    can_delete = False


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'order', 'amount', 'payment_method', 'status', 'created_at']
    list_filter = ['payment_method', 'status', 'created_at']
    search_fields = ['transaction_id', 'order__order_number']
    readonly_fields = ['created_at', 'updated_at', 'verification_data', 'webhook_data']
    date_hierarchy = 'created_at'
    inlines = [PaymentHistoryInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('transaction_id', 'order', 'amount', 'payment_method', 'status', 'created_at', 'updated_at')
        }),
        ('Verification Data', {
            'fields': ('verification_data',),
            'classes': ('collapse',),
        }),
        ('Webhook Data', {
            'fields': ('webhook_data',),
            'classes': ('collapse',),
        }),
    )


@admin.register(PaymentHistory)
class PaymentHistoryAdmin(admin.ModelAdmin):
    list_display = ['payment', 'old_status', 'new_status', 'created_at']
    list_filter = ['created_at']
    search_fields = ['payment__transaction_id']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
