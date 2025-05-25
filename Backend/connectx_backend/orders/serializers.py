from rest_framework import serializers
from .models import Order, OrderProductItem, OrderHistory, RefundRequest, Refund
from products.serializers import ProductSerializer
from tenants.serializers import TenantSerializer
from users.serializers import UserSerializer
from shipping.serializers import ShippingAddressSerializer


# Simplified serializers for nested representation
class MinimalTenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantSerializer.Meta.model
        fields = ['id', 'name']


class MinimalUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSerializer.Meta.model
        fields = ['id', 'name']


class MinimalShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddressSerializer.Meta.model
        fields = ['id', 'full_address', 'phone_number']


class MinimalProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSerializer.Meta.model
        fields = ['id', 'name', 'sku', 'cover_url']


# Very minimal serializers for history and items
class SimpleOrderHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderHistory
        fields = ["status", "description", "created_at"]


class SimpleOrderProductItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_id = serializers.UUIDField(source='product.id', read_only=True)
    product_owner_tenant_name = serializers.CharField(source='product.owner.name', read_only=True)
    product_owner_tenant_id = serializers.UUIDField(source='product.owner.id', read_only=True)
    
    class Meta:
        model = OrderProductItem
        fields = [
            "product_id",
            "product_name",
            "product_owner_tenant_id",
            "product_owner_tenant_name",
            "quantity",
            "price",
            "custom_selling_price",
        ]


# Main serializers for detail views (one record at a time)
class OrderProductItemSerializer(serializers.ModelSerializer):
    product_details = MinimalProductSerializer(source='product', read_only=True)
    product_owner_tenant_name = serializers.CharField(source='product.owner.name', read_only=True)
    product_owner_tenant_id = serializers.UUIDField(source='product.owner.id', read_only=True)
    
    class Meta:
        model = OrderProductItem
        fields = [
            "id",
            "product",
            "product_details",
            "product_owner_tenant_id",
            "product_owner_tenant_name",
            "quantity",
            "price",
            "custom_profit_percentage",
            "custom_selling_price",
        ]
        read_only_fields = ("id", "product_details", "product_owner_tenant_id", "product_owner_tenant_name")
        swagger_schema_fields = {
            "example": {
                "product": "product-uuid",
                "quantity": 2,
                "price": "299.99",
                "custom_profit_percentage": 10.0,
                "custom_selling_price": "329.99",
            }
        }


class OrderHistorySerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.name', read_only=True)
    
    class Meta:
        model = OrderHistory
        fields = [
            "status",
            "description",
            "created_by_name",
            "created_at",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderProductItemSerializer(many=True, required=False)
    history = OrderHistorySerializer(many=True, read_only=True)
    seller_tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    seller_tenant_id = serializers.UUIDField(source='tenant.id', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    shipping_address_details = MinimalShippingAddressSerializer(source='shipping_address', read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "seller_tenant_id",
            "seller_tenant_name",
            "user_name",
            "status",
            "subtotal",
            "taxes",
            "shipping",
            "discount",
            "total_amount",
            "notes",
            "email",
            "phone",
            "created_at",
            "updated_at",
            "shipping_address_details",
            "items",
            "history",
        ]
        read_only_fields = ("id", "order_number", "total_amount", "created_at", "updated_at",
                            "seller_tenant_name", "seller_tenant_id", "user_name")
        swagger_schema_fields = {
            "example": {
                "status": "pending",
                "subtotal": "500.00",
                "taxes": "50.00",
                "shipping": "20.00",
                "discount": "10.00",
                "notes": "Please deliver to the back door",
                "email": "customer@example.com",
                "phone": "+1234567890",
                "shipping_address": "shipping-address-uuid",
                "items": [
                    {
                        "product": "product-uuid",
                        "quantity": 2,
                        "price": "299.99",
                        "custom_profit_percentage": 10.0,
                        "custom_selling_price": "329.99",
                    }
                ],
            }
        }

    def create(self, validated_data):
        """Handle nested product items when creating an order."""
        # Extract nested data
        items_data = validated_data.pop("items", [])
        validated_data.pop('tenant', None)  # These will be set in perform_create
        validated_data.pop('user', None)
        
        # Create the order
        order = Order.objects.create(**validated_data)
        
        # Create items and set product_owner
        for item_data in items_data:
            product = item_data.get('product')
            OrderProductItem.objects.create(
                order=order,
                product_owner=product.owner,
                **item_data
            )
            
        # Create initial order history entry
        OrderHistory.objects.create(
            order=order,
            status=order.status,
            name=f"Order {order.status}",
            description=f"Order has been {order.status}",
            created_by=self.context.get('request').user if 'request' in self.context else None
        )
        
        return order
        
    def update(self, instance, validated_data):
        """Handle nested product items when updating an order."""
        items_data = validated_data.pop("items", None)
        
        # Track status changes for history
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        # Update the order instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Create history entry if status changed
        if old_status != new_status:
            OrderHistory.objects.create(
                order=instance,
                status=new_status,
                name=f"Order {new_status}",
                description=f"Order status changed from {old_status} to {new_status}",
                created_by=self.context['request'].user if 'request' in self.context else None
            )
        
        # Handle items if provided
        if items_data is not None:
            # Clear existing items
            instance.items.all().delete()
            
            # Create new items
            for item_data in items_data:
                product = item_data.get('product')
                OrderProductItem.objects.create(
                    order=instance,
                    product_owner=product.owner,
                    **item_data
                )
                
        return instance


# Ultra-lightweight serializer for list views
class OrderListSerializer(serializers.ModelSerializer):
    seller_tenant_name = serializers.CharField(source='tenant.name', read_only=True)
    seller_tenant_id = serializers.UUIDField(source='tenant.id', read_only=True)
    items_count = serializers.SerializerMethodField()
    total_quantity = serializers.SerializerMethodField()
    first_item = serializers.SerializerMethodField()
    payment_status = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "seller_tenant_id",
            "seller_tenant_name",
            "status",
            "total_amount",
            "created_at",
            "items_count",
            "total_quantity",
            "first_item",
            "payment_status",
        ]
    
    def get_items_count(self, obj):
        return obj.items.count()
    
    def get_total_quantity(self, obj):
        """Calculate the total quantity of all items in the order."""
        return sum(item.quantity for item in obj.items.all())
    
    def get_first_item(self, obj):
        """Get simplified details of the first item in the order for display purposes."""
        first_item = obj.items.first()
        if not first_item:
            return None
        
        return {
            "product_name": first_item.product.name,
            "product_id": str(first_item.product.id),
            "cover_url": first_item.product.cover_url,
        }
    
    def get_payment_status(self, obj):
        """Get simplified payment status information."""
        # Safer approach that doesn't rely on the OrderPayment model's structure
        try:
            # Use values() to control exactly which fields are fetched
            payment = obj.payments.values('status', 'payment_method').first()
            if not payment:
                return {
                    "display_status": "Not Initiated",
                    "method": None
                }
            
            # Map payment status to display text
            status_map = {
                "pending": "Pending",
                "processing": "Processing",
                "completed": "Completed",
                "failed": "Failed",
                "cancelled": "Cancelled",
                "refunded": "Refunded"
            }
            
            return {
                "display_status": status_map.get(payment['status'], payment['status']),
                "method": payment['payment_method']
            }
        except Exception:
            # Fallback if any error occurs with payments
            return {
                "display_status": "Unknown",
                "method": None
            }


# Write-specific serializer for creating/updating orders
class WriteOrderSerializer(serializers.ModelSerializer):
    items = OrderProductItemSerializer(many=True, required=False)
    selling_tenant_id = serializers.UUIDField(required=False, help_text="ID of the selling tenant that will fulfill the order")
    
    class Meta:
        model = Order
        fields = [
            "id",
            "order_number",
            "selling_tenant_id",
            "status",
            "subtotal",
            "taxes",
            "shipping",
            "discount",
            "notes",
            "email",
            "phone",
            "shipping_address",
            "items",
        ]
        read_only_fields = ["id", "order_number"]
        swagger_schema_fields = {
            "example": {
                "selling_tenant_id": "tenant-uuid",
                "status": "pending",
                "subtotal": "500.00",
                "taxes": "50.00",
                "shipping": "20.00",
                "discount": "10.00",
                "notes": "Please deliver to the back door",
                "email": "customer@example.com",
                "phone": "+1234567890",
                "shipping_address": "shipping-address-uuid",
                "items": [
                    {
                        "product": "product-uuid",
                        "quantity": 2,
                        "price": "299.99",
                        "custom_profit_percentage": 10.0,
                        "custom_selling_price": "329.99",
                    }
                ],
            }
        }

    def create(self, validated_data):
        """Handle nested product items when creating an order."""
        # Extract nested data
        items_data = validated_data.pop("items", [])
        
        # Create the order
        order = Order.objects.create(**validated_data)
        
        # Create items and set product_owner
        for item_data in items_data:
            product = item_data.get('product')
            OrderProductItem.objects.create(
                order=order,
                product_owner=product.owner,
                **item_data
            )
            
        # Create initial order history entry
        OrderHistory.objects.create(
            order=order,
            status=order.status,
            name=f"Order {order.status}",
            description=f"Order has been {order.status}",
            created_by=self.context.get('request').user if 'request' in self.context else None
        )
        
        return order
        
    def update(self, instance, validated_data):
        """Handle nested product items when updating an order."""
        items_data = validated_data.pop("items", None)
        
        # Track status changes for history
        old_status = instance.status
        new_status = validated_data.get('status', old_status)
        
        # Update the order instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Create history entry if status changed
        if old_status != new_status:
            OrderHistory.objects.create(
                order=instance,
                status=new_status,
                name=f"Order {new_status}",
                description=f"Order status changed from {old_status} to {new_status}",
                created_by=self.context['request'].user if 'request' in self.context else None
            )
        
        # Handle items if provided
        if items_data is not None:
            # Clear existing items
            instance.items.all().delete()
            
            # Create new items
            for item_data in items_data:
                product = item_data.get('product')
                OrderProductItem.objects.create(
                    order=instance,
                    product_owner=product.owner,
                    **item_data
                )
                
        return instance


class RefundRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefundRequest
        fields = ['id', 'order', 'reason', 'status', 'created_at', 'updated_at', 'admin_notes']
        read_only_fields = ['status', 'admin_notes']


class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = ['id', 'refund_request', 'amount', 'transaction_id', 'refunded_at', 'payment_method', 'status']
        read_only_fields = ['transaction_id', 'refunded_at', 'status']
