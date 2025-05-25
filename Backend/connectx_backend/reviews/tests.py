from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.urls import reverse
from tenants.models import Tenant
from products.models import Product
from categories.models import Category
from orders.models import Order, OrderItem
from .models import Review
import uuid

User = get_user_model()


class ReviewSystemTestCase(APITestCase):
    def setUp(self):
        # Create test tenant
        self.tenant = Tenant.objects.create(
            name="TestTenant",
            email="tenant@example.com",
            password="tenantpass123"
        )
        
        # Create test users
        self.customer = User.objects.create_user(
            email="customer@example.com",
            password="testpass123",
            name="Test Customer",
            tenant=self.tenant,
            role=User.CUSTOMER
        )
        
        # Create test category
        self.category = Category.objects.create(
            name="Electronics",
            tenant=self.tenant,
            description="Test electronics category"
        )
        
        # Create test product
        self.product = Product.objects.create(
            name="Test Product",
            base_price=100.00,
            quantity=10,
            category=self.category,
            owner=self.tenant,
            description="Test product description"
        )
        
        # Create delivered order to allow review
        self.order = Order.objects.create(
            tenant=self.tenant,
            user=self.customer,
            order_number=f"ORD-{uuid.uuid4()}",
            status="delivered",
            subtotal=100.00,
            total_amount=100.00
        )
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=1,
            price=100.00
        )
        
        self.client = APIClient()

    def test_create_review_success(self):
        """Test successful review creation"""
        self.client.force_authenticate(user=self.customer)
        
        url = reverse('review-list')
        data = {
            'product': str(self.product.id),
            'rating': 5,
            'comment': 'Excellent product!'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 1)
        
        review = Review.objects.first()
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.comment, 'Excellent product!')
        self.assertEqual(review.user, self.customer)
        self.assertEqual(review.product, self.product)

    def test_create_review_without_purchase(self):
        """Test review creation fails without purchase"""
        # Create user without purchase
        another_user = User.objects.create_user(
            email="another@example.com",
            password="testpass123",
            name="Another User",
            tenant=self.tenant,
            role=User.CUSTOMER
        )
        
        self.client.force_authenticate(user=another_user)
        
        url = reverse('review-list')
        data = {
            'product': str(self.product.id),
            'rating': 5,
            'comment': 'Excellent product!'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Review.objects.count(), 0)

    def test_duplicate_review_prevention(self):
        """Test that users cannot review the same product twice"""
        self.client.force_authenticate(user=self.customer)
        
        # Create first review
        Review.objects.create(
            tenant=self.tenant,
            product=self.product,
            user=self.customer,
            rating=4,
            comment='First review',
            is_purchased=True
        )
        
        url = reverse('review-list')
        data = {
            'product': str(self.product.id),
            'rating': 5,
            'comment': 'Second review attempt'
        }
        
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Review.objects.count(), 1)

    def test_get_product_reviews(self):
        """Test getting reviews for a specific product"""
        # Create multiple reviews
        Review.objects.create(
            tenant=self.tenant,
            product=self.product,
            user=self.customer,
            rating=5,
            comment='Great product!',
            is_purchased=True
        )
        
        url = reverse('review-product-reviews')
        response = self.client.get(url, {'product_id': str(self.product.id)})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['rating'], 5)

    def test_get_product_stats(self):
        """Test getting review statistics for a product"""
        # Create multiple reviews with different ratings
        ratings = [5, 4, 4, 3, 5]
        for i, rating in enumerate(ratings):
            user = User.objects.create_user(
                email=f"user{i}@example.com",
                password="testpass123",
                name=f"User {i}",
                tenant=self.tenant,
                role=User.CUSTOMER
            )
            
            # Create order for each user
            order = Order.objects.create(
                tenant=self.tenant,
                user=user,
                order_number=f"ORD-{uuid.uuid4()}",
                status="delivered",
                subtotal=100.00,
                total_amount=100.00
            )
            OrderItem.objects.create(
                order=order,
                product=self.product,
                quantity=1,
                price=100.00
            )
            
            Review.objects.create(
                tenant=self.tenant,
                product=self.product,
                user=user,
                rating=rating,
                comment=f'Review {i}',
                is_purchased=True
            )
        
        url = reverse('review-product-stats')
        response = self.client.get(url, {'product_id': str(self.product.id)})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        stats = response.data
        self.assertEqual(stats['total_reviews'], 5)
        self.assertEqual(stats['average_rating'], 4.2)  # (5+4+4+3+5)/5 = 4.2
        
        # Check rating distribution
        expected_distribution = {'1': 0, '2': 0, '3': 1, '4': 2, '5': 2}
        self.assertEqual(stats['rating_distribution'], expected_distribution)

    def test_get_product_summary(self):
        """Test getting product reviews summary"""
        Review.objects.create(
            tenant=self.tenant,
            product=self.product,
            user=self.customer,
            rating=5,
            comment='Excellent!',
            is_purchased=True
        )
        
        url = reverse('review-product-summary')
        response = self.client.get(url, {
            'product_id': str(self.product.id),
            'limit': 5
        })
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        data = response.data
        self.assertIn('reviews', data)
        self.assertIn('stats', data)
        
        self.assertEqual(len(data['reviews']), 1)
        self.assertEqual(data['stats']['total_reviews'], 1)
        self.assertEqual(data['stats']['average_rating'], 5.0)

    def test_my_reviews(self):
        """Test getting current user's reviews"""
        self.client.force_authenticate(user=self.customer)
        
        Review.objects.create(
            tenant=self.tenant,
            product=self.product,
            user=self.customer,
            rating=4,
            comment='My review',
            is_purchased=True
        )
        
        url = reverse('review-my-reviews')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['user_name'], self.customer.name)

    def test_update_review(self):
        """Test updating own review"""
        self.client.force_authenticate(user=self.customer)
        
        review = Review.objects.create(
            tenant=self.tenant,
            product=self.product,
            user=self.customer,
            rating=4,
            comment='Original comment',
            is_purchased=True
        )
        
        url = reverse('review-detail', kwargs={'pk': review.id})
        data = {
            'rating': 5,
            'comment': 'Updated comment'
        }
        
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        review.refresh_from_db()
        self.assertEqual(review.rating, 5)
        self.assertEqual(review.comment, 'Updated comment')

    def test_delete_review(self):
        """Test deleting own review"""
        self.client.force_authenticate(user=self.customer)
        
        review = Review.objects.create(
            tenant=self.tenant,
            product=self.product,
            user=self.customer,
            rating=4,
            comment='To be deleted',
            is_purchased=True
        )
        
        url = reverse('review-detail', kwargs={'pk': review.id})
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Review.objects.count(), 0)

    def test_product_review_summary_in_product_endpoint(self):
        """Test that product endpoints include review summary"""
        # Create a review
        Review.objects.create(
            tenant=self.tenant,
            product=self.product,
            user=self.customer,
            rating=5,
            comment='Great product!',
            is_purchased=True
        )
        
        # Get product details
        url = reverse('product-detail', kwargs={'pk': self.product.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that review summary is included
        product_data = response.data
        self.assertIn('review_summary', product_data)
        
        review_summary = product_data['review_summary']
        self.assertEqual(review_summary['total_reviews'], 1)
        self.assertEqual(review_summary['average_rating'], 5.0)
        self.assertIn('rating_distribution', review_summary)

    def test_unauthenticated_access(self):
        """Test that unauthenticated users can view reviews but not create them"""
        Review.objects.create(
            tenant=self.tenant,
            product=self.product,
            user=self.customer,
            rating=5,
            comment='Public review',
            is_purchased=True
        )
        
        # Test viewing reviews without authentication
        url = reverse('review-product-reviews')
        response = self.client.get(url, {'product_id': str(self.product.id)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test viewing stats without authentication
        url = reverse('review-product-stats')
        response = self.client.get(url, {'product_id': str(self.product.id)})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Test creating review without authentication
        url = reverse('review-list')
        data = {
            'product': str(self.product.id),
            'rating': 5,
            'comment': 'Should fail'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
