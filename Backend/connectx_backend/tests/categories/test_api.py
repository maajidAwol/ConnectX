import pytest
import uuid
from django.urls import reverse
from rest_framework import status
from categories.models import Category


@pytest.mark.django_db
class TestCategoryAPI:
    """
    Test suite for Category API endpoints.
    """

    @pytest.fixture
    def category_data(self, tenant):
        """Test data for category creation."""
        return {
            "tenant": str(tenant.id),
            "name": "Test Category",
            "description": "Test category description",
            "icon": "test-icon",
        }

    @pytest.fixture
    def category(self, category_factory, tenant):
        """Create a test category."""
        return category_factory.create(tenant=tenant)

    @pytest.fixture
    def subcategory_data(self, category, tenant):
        """Test data for subcategory creation."""
        return {
            "tenant": str(tenant.id),
            "name": "Test Subcategory",
            "description": "Test subcategory description",
            "icon": "test-sub-icon",
            "parent": str(category.id),
        }

    @pytest.fixture
    def category_update_data(self):
        """Test data for category update."""
        return {
            "name": "Updated Category Name",
            "description": "Updated category description",
            "icon": "updated-icon",
        }

    def test_category_list_authenticated(self, auth_client, category_factory):
        """
        Test that authenticated users can list categories.
        """
        client, user = auth_client
        # Create a category for the user's tenant
        category_factory.create(tenant=user.tenant)

        url = reverse("category-list")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list) or "results" in response.data
        # If it's paginated, check results key
        results = (
            response.data
            if isinstance(response.data, list)
            else response.data["results"]
        )
        assert len(results) > 0

    def test_category_list_unauthenticated(self, api_client):
        """
        Test that unauthenticated users cannot list categories.
        """
        url = reverse("category-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test1_category_create_as_owner(self, owner_client, category_data):
        """
        Test that tenant owners can create categories.
        """
        client, _ = owner_client
        url = reverse("category-list")
        response = client.post(url, category_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == category_data["name"]
        assert response.data["description"] == category_data["description"]
        assert response.data["icon"] == category_data["icon"]

    def test_category_create_as_customer(self, auth_client, category_data):
        """
        Test that regular customers cannot create categories.
        """
        client, _ = auth_client
        url = reverse("category-list")
        response = client.post(url, category_data)

        # Regular customers should not be able to create categories
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_category_create_invalid_data(self, owner_client, tenant):
        """
        Test category creation with invalid data.
        """
        client, _ = owner_client
        url = reverse("category-list")

        # Missing required fields
        invalid_data = {
            "description": "Test category without name"
            # Missing name
        }
        response = client.post(url, invalid_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_subcategory_create(self, owner_client, category_factory, subcategory_data):
        """
        Test creating a subcategory under an existing category.
        """
        client, owner = owner_client
        # Parent category is provided in subcategory_data fixture

        url = reverse("category-list")
        response = client.post(url, subcategory_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == subcategory_data["name"]
        assert str(response.data["parent"]) == subcategory_data["parent"]

    def test_category_retrieve(self, auth_client, category_factory):
        """
        Test that categories can be retrieved by ID.
        """
        client, user = auth_client
        category = category_factory.create(tenant=user.tenant)

        url = reverse("category-detail", kwargs={"pk": category.id})
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == str(category.id)
        assert response.data["name"] == category.name
        assert response.data["description"] == category.description

    def test_category_retrieve_different_tenant(
        self, auth_client, category_factory, tenant_factory
    ):
        """
        Test that users cannot retrieve categories from different tenants.
        """
        client, _ = auth_client
        other_tenant = tenant_factory.create()
        other_category = category_factory.create(tenant=other_tenant)

        url = reverse("category-detail", kwargs={"pk": other_category.id})
        response = client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test1_category_update(
        self, owner_client, category_factory, category_update_data
    ):
        """
        Test that tenant owners can update categories.
        """
        client, owner = owner_client
        category = category_factory.create(tenant=owner.tenant)

        url = reverse("category-detail", kwargs={"pk": category.id})
        response = client.put(url, category_update_data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == category_update_data["name"]
        assert response.data["description"] == category_update_data["description"]
        assert response.data["icon"] == category_update_data["icon"]

    def test_category_partial_update(self, owner_client, category_factory):
        """
        Test that categories can be partially updated.
        """
        client, owner = owner_client
        category = category_factory.create(tenant=owner.tenant)

        url = reverse("category-detail", kwargs={"pk": category.id})
        partial_update_data = {"name": "Partially Updated Category"}

        response = client.patch(url, partial_update_data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == partial_update_data["name"]
        # Other fields should remain unchanged
        assert response.data["description"] == category.description

    def test_category_delete(self, owner_client, category_factory):
        """
        Test that tenant owners can delete categories.
        """
        client, owner = owner_client
        category = category_factory.create(tenant=owner.tenant)

        url = reverse("category-detail", kwargs={"pk": category.id})
        response = client.delete(url)

        # Depending on the implementation, could be 204 or 200
        assert response.status_code in [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK]

        # Verify category is deleted
        response = client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_customer_cannot_delete_category(self, auth_client, category_factory):
        """
        Test that regular customers cannot delete categories.
        """
        client, user = auth_client
        category = category_factory.create(tenant=user.tenant)

        url = reverse("category-detail", kwargs={"pk": category.id})
        response = client.delete(url)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_category_with_subcategories(self, owner_client, category_factory):
        """
        Test deleting a category that has subcategories.
        """
        client, owner = owner_client
        parent_category = category_factory.create(tenant=owner.tenant)

        # Create a subcategory
        subcategory = category_factory.create(
            tenant=owner.tenant, parent=parent_category, name="Subcategory"
        )

        url = reverse("category-detail", kwargs={"pk": parent_category.id})
        response = client.delete(url)

        # This behavior depends on the implementation:
        # If CASCADE is used, the response should be 200/204
        # If RESTRICT is used, it might return a 400 error
        assert response.status_code in [
            status.HTTP_204_NO_CONTENT,
            status.HTTP_200_OK,
            status.HTTP_400_BAD_REQUEST,
        ]

        # If deletion succeeded, verify both are gone
        if response.status_code in [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK]:
            response = client.get(url)
            assert response.status_code == status.HTTP_404_NOT_FOUND

            # Subcategory should also be deleted if CASCADE is used
            subcategory_url = reverse("category-detail", kwargs={"pk": subcategory.id})
            response = client.get(subcategory_url)
            assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_nonexistent_category(self, owner_client):
        """
        Test handling of non-existent category IDs.
        """
        client, _ = owner_client
        non_existent_id = uuid.uuid4()
        url = reverse("category-detail", kwargs={"pk": non_existent_id})

        # Test GET request
        response = client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND

        # Test PUT request
        response = client.put(url, {"name": "Test"})
        assert response.status_code == status.HTTP_404_NOT_FOUND

        # Test DELETE request
        response = client.delete(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND