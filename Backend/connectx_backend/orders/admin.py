from django.contrib import admin
from .models import Order, OrderProductItem, OrderHistory


class OrderProductItemInline(admin.TabularInline):
    model = OrderProductItem
    extra = 0
    readonly_fields = ['product_owner']


class OrderHistoryInline(admin.TabularInline):
    model = OrderHistory
    extra = 0
    readonly_fields = ['created_at']
    

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'tenant', 'listing_tenant', 'user', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'tenant', 'listing_tenant', 'created_at']
    search_fields = ['order_number', 'user__name', 'user__email']
    readonly_fields = ['order_number', 'total_amount', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    inlines = [OrderProductItemInline, OrderHistoryInline]
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'status', 'created_at', 'updated_at')
        }),
        ('Tenant Information', {
            'fields': ('tenant', 'listing_tenant')
        }),
        ('Customer Information', {
            'fields': ('user', 'email', 'phone', 'shipping_address', 'notes')
        }),
        ('Financial Information', {
            'fields': ('subtotal', 'taxes', 'shipping', 'discount', 'total_amount')
        }),
    )


@admin.register(OrderProductItem)
class OrderProductItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'product_owner', 'quantity', 'price', 'custom_selling_price']
    list_filter = ['order__status', 'product_owner']
    search_fields = ['order__order_number', 'product__name']
    readonly_fields = ['product_owner']
    

@admin.register(OrderHistory)
class OrderHistoryAdmin(admin.ModelAdmin):
    list_display = ['order', 'status', 'name', 'created_by', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order__order_number', 'description']
    readonly_fields = ['created_at']
