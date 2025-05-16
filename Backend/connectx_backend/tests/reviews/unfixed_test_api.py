import pytest
import uuid
from django.urls import reverse
from rest_framework import status
from reviews.models import Review
from orders.models import Order


@pytest.mark.django_db
class TestReviewAPI:
    """
    Test suite for Review API endpoints.
    """

    @pytest.fixture
    def review_data(self, product_factory, user, tenant):
        """Test data for review creation."""
        product = product_factory.create(tenant=tenant)
        # Create a delivered order for the product
        order = Order.objects.create(
            tenant=tenant,
            user=user,
            order_number=f"ORD-{uuid.uuid4()}",
            status="delivered",
            subtotal=100.00,
            total_amount=100.00,
            shipping_address=None,  # Not required for testing reviews
        )
        order.items.create(product=product, quantity=1, price=100.00)

        return {
            "product": str(product.id),
            "rating": 4,
            "title": "Test Review",
            "comment": "This is a test review comment.",
        }

    @pytest.fixture
    def review_update_data(self):
        """Test data for review update."""
        return {
            "rating": 3,
            "title": "Updated Review Title",
            "comment": "This is an updated review comment.",
        }

    def test_review_list_authenticated(self, auth_client, review_factory):
        """
        Test that authenticated users can list reviews.
        """
        client, user = auth_client
        # Create a review for the user
        review_factory.create(user=user, tenant=user.tenant)

        url = reverse("review-list")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list) or "results" in response.data
        results = (
            response.data
            if isinstance(response.data, list)
            else response.data["results"]
        )
        assert len(results) > 0

    def test_review_list_filter_by_product(
        self, auth_client, review_factory, product_factory
    ):
        """
        Test filtering reviews by product.
        """
        client, user = auth_client
        product = product_factory.create(tenant=user.tenant)
        # Create a review for this product
        review_factory.create(user=user, tenant=user.tenant, product=product)

        url = f"{reverse('review-list')}?product={product.id}"
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        results = (
            response.data
            if isinstance(response.data, list)
            else response.data["results"]
        )
        assert len(results) > 0
        assert all(str(review["product"]) == str(product.id) for review in results)

    def test_review_list_unauthenticated(self, api_client):
        """
        Test that unauthenticated users cannot list reviews.
        """
        url = reverse("review-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_review_create(self, auth_client, review_data):
        """
        Test that authenticated users can create reviews for purchased products.
        """
        client, _ = auth_client
        url = reverse("review-list")
        response = client.post(url, review_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["rating"] == review_data["rating"]
        assert response.data["title"] == review_data["title"]
        assert response.data["comment"] == review_data["comment"]

    def test_review_create_without_purchase(self, auth_client, product_factory):
        """
        Test that users cannot review products they haven't purchased.
        """
        client, user = auth_client
        product = product_factory.create(tenant=user.tenant)

        review_data = {
            "product": str(product.id),
            "rating": 4,
            "title": "Test Review",
            "comment": "This is a test review comment.",
        }

        url = reverse("review-list")
        response = client.post(url, review_data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "must purchase the product" in str(response.data).lower()

    def test_review_create_invalid_data(self, auth_client, product_factory, tenant):
        """
        Test review creation with invalid data.
        """
        client, user = auth_client
        product = product_factory.create(tenant=tenant)

        # Create a delivered order for the product
        order = Order.objects.create(
            tenant=tenant,
            user=user,
            order_number=f"ORD-{uuid.uuid4()}",
            status="delivered",
            subtotal=100.00,
            total_amount=100.00,
            shipping_address=None,  # Not required for testing reviews
        )
        order.items.create(product=product, quantity=1, price=100.00)

        url = reverse("review-list")

        # Missing required fields
        invalid_data = {
            "product": str(product.id),
            # Missing rating and title
            "comment": "Test comment",
        }
        response = client.post(url, invalid_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "rating" in response.data
        assert "title" in response.data

        # Invalid rating (out of range)
        invalid_data = {
            "product": str(product.id),
            "rating": 6,  # Invalid: must be 1-5
            "title": "Test Review",
            "comment": "This is a test review comment.",
        }
        response = client.post(url, invalid_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "rating" in str(response.data).lower()

        # Rating below minimum
        invalid_data["rating"] = 0
        response = client.post(url, invalid_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "rating" in str(response.data).lower()

    def test_review_retrieve(self, auth_client, review_factory):
        """
        Test that reviews can be retrieved by ID.
        """
        client, user = auth_client
        review = review_factory.create(user=user, tenant=user.tenant)

        url = reverse("review-detail", kwargs={"pk": review.id})
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == str(review.id)
        assert response.data["rating"] == review.rating
        assert response.data["title"] == review.title
        assert response.data["comment"] == review.comment

    def test_review_retrieve_different_tenant(
        self, auth_client, review_factory, tenant_factory, user_factory
    ):
        """
        Test that users can retrieve reviews from different tenants.
        """
        client, _ = auth_client
        other_tenant = tenant_factory.create()
        other_user = user_factory.create(tenant=other_tenant)
        other_review = review_factory.create(user=other_user, tenant=other_tenant)

        url = reverse("review-detail", kwargs={"pk": other_review.id})
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == str(other_review.id)

    def test_review_update_own(self, auth_client, review_factory, review_update_data):
        """
        Test that users can update their own reviews.
        """
        client, user = auth_client
        review = review_factory.create(user=user, tenant=user.tenant)

        url = reverse("review-detail", kwargs={"pk": review.id})
        response = client.put(url, review_update_data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["rating"] == review_update_data["rating"]
        assert response.data["title"] == review_update_data["title"]
        assert response.data["comment"] == review_update_data["comment"]

    def test_review_update_others(
        self, auth_client, review_factory, user_factory, review_update_data
    ):
        """
        Test that users cannot update other users' reviews.
        """
        client, _ = auth_client
        other_user = user_factory.create(tenant=auth_client[1].tenant)
        other_review = review_factory.create(user=other_user, tenant=other_user.tenant)

        url = reverse("review-detail", kwargs={"pk": other_review.id})
        response = client.put(url, review_update_data)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_review_partial_update(self, auth_client, review_factory):
        """
        Test that reviews can be partially updated.
        """
        client, user = auth_client
        review = review_factory.create(user=user, tenant=user.tenant)

        url = reverse("review-detail", kwargs={"pk": review.id})
        response = client.patch(url, {"rating": 2})

        assert response.status_code == status.HTTP_200_OK
        assert response.data["rating"] == 2
        assert response.data["title"] == review.title  # Unchanged
        assert response.data["comment"] == review.comment  # Unchanged

    def test_review_delete_own(self, auth_client, review_factory):
        """
        Test that users can delete their own reviews.
        """
        client, user = auth_client
        review = review_factory.create(user=user, tenant=user.tenant)

        url = reverse("review-detail", kwargs={"pk": review.id})
        response = client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Review.objects.filter(id=review.id).exists()

    def test_review_delete_others(self, auth_client, review_factory, user_factory):
        """
        Test that users cannot delete other users' reviews.
        """
        client, _ = auth_client
        other_user = user_factory.create(tenant=auth_client[1].tenant)
        other_review = review_factory.create(user=other_user, tenant=other_user.tenant)

        url = reverse("review-detail", kwargs={"pk": other_review.id})
        response = client.delete(url)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert Review.objects.filter(id=other_review.id).exists()

    def test_admin_delete_review(self, admin_client, review_factory, user_factory):
        """
        Test that admin users can delete any review.
        """
        client, admin = admin_client
        other_user = user_factory.create(tenant=admin.tenant)
        review = review_factory.create(user=other_user, tenant=other_user.tenant)

        url = reverse("review-detail", kwargs={"pk": review.id})
        response = client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Review.objects.filter(id=review.id).exists()

    def test_multiple_reviews_same_product_user(self, auth_client, review_data):
        """
        Test that users cannot submit multiple reviews for the same product.
        """
        client, _ = auth_client
        url = reverse("review-list")

        # Create first review
        response = client.post(url, review_data)
        assert response.status_code == status.HTTP_201_CREATED

        # Try to create second review for the same product
        response = client.post(url, review_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "already reviewed" in str(response.data).lower()

    def test_nonexistent_review(self, auth_client):
        """
        Test handling of requests for nonexistent reviews.
        """
        client, _ = auth_client
        url = reverse("review-detail", kwargs={"pk": uuid.uuid4()})
        response = client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND