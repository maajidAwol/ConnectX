from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from unittest.mock import patch
from orders.models import Order, OrderProductItem
from orders.serializers import OrderListSerializer, MinimalProductSerializer
from products.models import Product
from categories.models import Category
from tenants.models import Tenant

User = get_user_model()


class OrderImageURLTestCase(TestCase):
    """Test case to verify that order serializers return proper image URLs."""

    def setUp(self):
        """Set up test data."""
        # Create a tenant
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            email="test@tenant.com",
            password="testpass123"
        )
        
        # Create a user
        self.user = User.objects.create_user(
            username="testuser",
            email="test@user.com",
            password="testpass123",
            tenant=self.tenant
        )
        
        # Create a category
        self.category = Category.objects.create(
            name="Test Category",
            description="Test category description"
        )
        
        # Create a product with a cover_url (public ID)
        self.product = Product.objects.create(
            name="Test Product",
            base_price=100.00,
            category=self.category,
            owner=self.tenant,
            cover_url="products/products/test-public-id"
        )
        
        # Create an order
        self.order = Order.objects.create(
            user=self.user,
            tenant=self.tenant,
            order_number="TEST-001",
            status="pending",
            total_amount=100.00
        )
        
        # Create an order item
        self.order_item = OrderProductItem.objects.create(
            order=self.order,
            product=self.product,
            product_owner=self.tenant,
            quantity=1,
            price=100.00
        )

    @patch('orders.serializers.generate_image_url')
    def test_order_list_serializer_generates_image_url(self, mock_generate_url):
        """Test that OrderListSerializer generates proper image URLs."""
        # Mock the generate_image_url function
        mock_generate_url.return_value = "https://res.cloudinary.com/test/image/upload/products/products/test-public-id"
        
        # Serialize the order
        serializer = OrderListSerializer(self.order)
        data = serializer.data
        
        # Check that the first_item has the correct cover_url
        self.assertIsNotNone(data['first_item'])
        self.assertEqual(
            data['first_item']['cover_url'],
            "https://res.cloudinary.com/test/image/upload/products/products/test-public-id"
        )
        
        # Verify that generate_image_url was called with the correct public ID
        mock_generate_url.assert_called_with("products/products/test-public-id")

    @patch('orders.serializers.generate_image_url')
    def test_minimal_product_serializer_generates_image_url(self, mock_generate_url):
        """Test that MinimalProductSerializer generates proper image URLs."""
        # Mock the generate_image_url function
        mock_generate_url.return_value = "https://res.cloudinary.com/test/image/upload/products/products/test-public-id"
        
        # Serialize the product
        serializer = MinimalProductSerializer(self.product)
        data = serializer.data
        
        # Check that the cover_url is properly generated
        self.assertEqual(
            data['cover_url'],
            "https://res.cloudinary.com/test/image/upload/products/products/test-public-id"
        )
        
        # Verify that generate_image_url was called with the correct public ID
        mock_generate_url.assert_called_with("products/products/test-public-id")

    @patch('orders.serializers.generate_image_url')
    def test_order_list_serializer_handles_no_cover_url(self, mock_generate_url):
        """Test that OrderListSerializer handles products without cover_url."""
        # Create a product without cover_url
        product_no_image = Product.objects.create(
            name="Product No Image",
            base_price=50.00,
            category=self.category,
            owner=self.tenant,
            cover_url=""  # No cover image
        )
        
        # Create an order item with this product
        OrderProductItem.objects.create(
            order=self.order,
            product=product_no_image,
            product_owner=self.tenant,
            quantity=1,
            price=50.00
        )
        
        # Delete the existing order item to make the new one first
        self.order_item.delete()
        
        # Serialize the order
        serializer = OrderListSerializer(self.order)
        data = serializer.data
        
        # Check that the first_item has None for cover_url
        self.assertIsNotNone(data['first_item'])
        self.assertIsNone(data['first_item']['cover_url'])
        
        # Verify that generate_image_url was not called
        mock_generate_url.assert_not_called()
