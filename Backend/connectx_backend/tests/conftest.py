import pytest
import uuid
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken
from pytest_factoryboy import register

# Get the User model
User = get_user_model()

# Import models after User model is defined
from tenants.models import Tenant
from categories.models import Category
from products.models import Product, ProductListing
from orders.models import Order, OrderProductItem
from shipping.models import ShippingAddress
from reviews.models import Review
from payments.models import OrderPayment


# Tenant Factory
@pytest.fixture
def tenant_factory(db):
    class TenantFactory:
        def create(self, **kwargs):
            defaults = {
                "name": f"Test Tenant {uuid.uuid4()}",
                "email": f"tenant-{uuid.uuid4()}@example.com",
                "password": "password123",
                "is_verified": True,
                "is_active": True,
            }
            defaults.update(kwargs)
            return Tenant.objects.create(**defaults)

    return TenantFactory()


# User Factory
@pytest.fixture
def user_factory(db, tenant_factory):
    class UserFactory:
        def create(self, **kwargs):
            tenant = kwargs.pop("tenant", tenant_factory.create())
            defaults = {
                "name": f"Test User {uuid.uuid4()}",
                "email": f"user-{uuid.uuid4()}@example.com",
                "password": "password123",
                "tenant": tenant,
                "role": User.CUSTOMER,
                "is_verified": True,
                "is_active": True,
            }
            defaults.update(kwargs)
            return User.objects.create(**defaults)

    return UserFactory()


# Category Factory
@pytest.fixture
def category_factory(db, tenant_factory):
    class CategoryFactory:
        def create(self, **kwargs):
            tenant = kwargs.pop("tenant", tenant_factory.create())
            defaults = {
                "name": f"Test Category {uuid.uuid4()}",
                "description": "Test category description",
                "tenant": tenant,
            }
            defaults.update(kwargs)
            return Category.objects.create(**defaults)

    return CategoryFactory()


# Product Factory
@pytest.fixture
def product_factory(db, tenant_factory, category_factory):
    class ProductFactory:
        def create(self, **kwargs):
            tenant = kwargs.pop("tenant", tenant_factory.create())
            category = kwargs.pop("category", category_factory.create(tenant=tenant))
            defaults = {
                "owner": tenant,
                "sku": f"SKU-{uuid.uuid4()}",
                "name": f"Test Product {uuid.uuid4()}",
                "base_price": 100.00,
                "profit_percentage": 20.00,
                "selling_price": 120.00,
                "quantity": 10,
                "category": category,
                "is_public": True,
                "description": "Test product description",
                "short_description": "Short description",
                "brand": "Test Brand",
                "warranty": "1 year",
            }
            defaults.update(kwargs)
            product = Product.objects.create(**defaults)

            # Add the owner tenant to the product's tenants
            ProductListing.objects.create(
                tenant=tenant,
                product=product,
                profit_percentage=defaults["profit_percentage"],
                selling_price=defaults["selling_price"],
            )

            return product

    return ProductFactory()


# Shipping Address Factory
@pytest.fixture
def shipping_address_factory(db, user_factory, tenant_factory):
    class ShippingAddressFactory:
        def create(self, **kwargs):
            user = kwargs.pop("user", user_factory.create())
            tenant = kwargs.pop("tenant", tenant_factory.create())
            defaults = {
                "user": user,
                "tenant": tenant,
                "full_name": f"Recipient {uuid.uuid4()}",
                "address_line_1": "123 Test Street",
                "city": "Test City",
                "state": "Test State",
                "postal_code": "12345",
                "country": "Test Country",
                "phone_number": "+1234567890",
                "is_default": True,
            }
            defaults.update(kwargs)
            return ShippingAddress.objects.create(**defaults)

    return ShippingAddressFactory()


# Order Factory
@pytest.fixture
def order_factory(db, tenant_factory, user_factory, shipping_address_factory):
    class OrderFactory:
        def create(self, **kwargs):
            tenant = kwargs.pop("tenant", tenant_factory.create())
            user = kwargs.pop("user", user_factory.create(tenant=tenant))
            shipping_address = kwargs.pop(
                "shipping_address",
                shipping_address_factory.create(user=user, tenant=tenant),
            )
            defaults = {
                "tenant": tenant,
                "user": user,
                "order_number": f"ORD-{uuid.uuid4()}",
                "status": "pending",
                "subtotal": 100.00,
                "taxes": 10.00,
                "shipping": 5.00,
                "discount": 0.00,
                "total_amount": 115.00,
                "shipping_address": shipping_address,
            }
            defaults.update(kwargs)
            return Order.objects.create(**defaults)

    return OrderFactory()


# Order Product Item Factory
@pytest.fixture
def order_item_factory(db, order_factory, product_factory):
    class OrderItemFactory:
        def create(self, **kwargs):
            order = kwargs.pop("order", order_factory.create())
            product = kwargs.pop("product", product_factory.create(tenant=order.tenant))
            defaults = {
                "order": order,
                "product": product,
                "quantity": 1,
                "price": product.selling_price,
            }
            defaults.update(kwargs)
            return OrderProductItem.objects.create(**defaults)

    return OrderItemFactory()


# Review Factory
@pytest.fixture
def review_factory(
    db, user_factory, product_factory, tenant_factory, order_factory, order_item_factory
):
    class ReviewFactory:
        def create(self, **kwargs):
            tenant = kwargs.pop("tenant", tenant_factory.create())
            user = kwargs.pop("user", user_factory.create(tenant=tenant))
            product = kwargs.pop("product", product_factory.create(tenant=tenant))

            # Create an order and order item for the product to simulate purchase
            order = kwargs.pop("order", order_factory.create(tenant=tenant, user=user))
            order_item = order_item_factory.create(order=order, product=product)

            defaults = {
                "tenant": tenant,
                "user": user,
                "product": product,
                "rating": 4,
                "title": "Test Review",
                "comment": "This is a test review comment.",
                "is_purchased": True,  # Set is_purchased to True since we create an order
            }
            defaults.update(kwargs)
            return Review.objects.create(**defaults)

    return ReviewFactory()


# Payment Factory
@pytest.fixture
def payment_factory(db, order_factory):
    class PaymentFactory:
        def create(self, **kwargs):
            order = kwargs.pop("order", order_factory.create())
            defaults = {
                "order": order,
                "tenant": order.tenant,
                "payment_method": "chapa",
                "status": "approved",
                "payment_id": f"TXN-{uuid.uuid4()}",
            }
            defaults.update(kwargs)
            return OrderPayment.objects.create(**defaults)

    return PaymentFactory()


# User fixtures
@pytest.fixture
def user(db, user_factory):
    return user_factory.create()


@pytest.fixture
def admin_user(db, user_factory):
    """Create an admin user for testing."""
    admin = user_factory.create(role=User.ADMIN, is_staff=True, is_superuser=True)
    return admin


@pytest.fixture
def tenant_owner(db, user_factory):
    return user_factory.create(role=User.OWNER)


# Tenant fixture
@pytest.fixture
def tenant(db, tenant_factory):
    return tenant_factory.create()


# Authentication fixtures
@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(user):
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client, user


@pytest.fixture
def admin_client(admin_user):
    client = APIClient()
    refresh = RefreshToken.for_user(admin_user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client, admin_user


@pytest.fixture
def owner_client(tenant_owner):
    client = APIClient()
    refresh = RefreshToken.for_user(tenant_owner)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client, tenant_owner
