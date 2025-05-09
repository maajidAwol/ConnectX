import pytest
from django.urls import reverse
from rest_framework import status
from tenants.models import Tenant
from users.models import User


@pytest.mark.django_db
class TestTenantAPI:
    """
    Test suite for Tenant API endpoints.
    """

    @pytest.fixture
    def tenant_data(self):
        """Test data for tenant creation."""
        return {
            "name": "Test Tenant",
            "email": "test@teststore.com",
            "password": "password123",
            "legal_name": "Test Business",
            "business_type": "Corporation",
            "business_registration_number": "BRN12345",
            "business_bio": "A test business description",
            "phone": "+1234567890",
            "address": "123 Test Street, Test City",
            "website_url": "https://teststore.com",
        }

    @pytest.fixture
    def tenant_update_data(self):
        """Test data for tenant update."""
        return {
            "legal_name": "Updated Business Name",
            "business_bio": "Updated business description",
            "phone": "+1987654321",
            "address": "456 Updated Street, Updated City",
        }

    def test_tenant_list_admin(self, admin_client):
        """
        Test that admin users can list all tenants.
        """
        client, _ = admin_client
        url = reverse("tenant-list")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, dict)
        assert "results" in response.data

    def test_tenant_list_owner(self, owner_client):
        """
        Test that tenant owners can only see their own tenant.
        """
        client, user = owner_client
        url = reverse("tenant-list")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, dict)
        assert "results" in response.data
        # Should only see one tenant (their own)
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["id"] == str(user.tenant.id)

    def test_tenant_list_customer(self, auth_client):
        """
        Test that customers can only see their tenant and/or public tenants.
        """
        client, user = auth_client
        url = reverse("tenant-list")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, dict)
        assert "results" in response.data
        # Should at least see their own tenant
        assert len(response.data["results"]) >= 1
        tenant_ids = [tenant["id"] for tenant in response.data["results"]]
        assert str(user.tenant.id) in tenant_ids

    def test_tenant_list_unauthenticated(self, api_client):
        """
        Test that unauthenticated users cannot list tenants.
        """
        url = reverse("tenant-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_tenant_create(self, api_client, tenant_data):
        """
        Test tenant creation.
        """
        url = reverse("tenant-list")
        response = api_client.post(url, tenant_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == tenant_data["name"]
        assert response.data["email"] == tenant_data["email"]
        assert "password" not in response.data  # Password should not be returned

    def test_tenant_create_invalid_data(self, api_client):
        """
        Test tenant creation with invalid data.
        """
        url = reverse("tenant-list")

        # Missing required fields
        invalid_data = {
            "name": "Test Tenant"
            # Missing email and password
        }
        response = api_client.post(url, invalid_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

        # Invalid email format
        invalid_data = {
            "name": "Test Tenant",
            "email": "invalid-email",
            "password": "password123",
        }
        response = api_client.post(url, invalid_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_tenant_retrieve(self, auth_client):
        """
        Test that tenants can be retrieved by ID.
        """
        client, user = auth_client
        url = reverse("tenant-detail", kwargs={"pk": user.tenant.id})
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == str(user.tenant.id)
        assert response.data["name"] == user.tenant.name
        assert response.data["email"] == user.tenant.email

    def test_tenant_retrieve_different_tenant(self, auth_client, tenant_factory):
        """
        Test that users cannot retrieve tenants they don't belong to.
        """
        client, _ = auth_client
        other_tenant = tenant_factory.create()  # Creates a different tenant

        url = reverse("tenant-detail", kwargs={"pk": other_tenant.id})
        response = client.get(url)

        # Depending on the implementation, this could be 403 or 404
        assert response.status_code in [
            status.HTTP_403_FORBIDDEN,
            status.HTTP_404_NOT_FOUND,
        ]

    def test_tenant_update(self, owner_client, tenant_update_data):
        """
        Test that tenant owners can update their tenant.
        """
        client, user = owner_client
        url = reverse("tenant-detail", kwargs={"pk": user.tenant.id})
        response = client.put(url, tenant_update_data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["legal_name"] == tenant_update_data["legal_name"]
        assert response.data["business_bio"] == tenant_update_data["business_bio"]
        assert response.data["phone"] == tenant_update_data["phone"]

    def test_tenant_update_as_customer(self, auth_client, tenant_update_data):
        """
        Test that customers cannot update the tenant.
        """
        client, user = auth_client
        url = reverse("tenant-detail", kwargs={"pk": user.tenant.id})
        response = client.put(url, tenant_update_data)

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_tenant_partial_update(self, owner_client):
        """
        Test that tenant owners can partially update their tenant.
        """
        client, user = owner_client
        url = reverse("tenant-detail", kwargs={"pk": user.tenant.id})
        partial_update_data = {"legal_name": "Partially Updated Name"}

        response = client.patch(url, partial_update_data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["legal_name"] == partial_update_data["legal_name"]

    def test_tenant_delete_as_admin(self, admin_client, tenant_factory):
        """
        Test that admin users can delete tenants.
        """
        client, _ = admin_client
        tenant_to_delete = tenant_factory.create()
        url = reverse("tenant-detail", kwargs={"pk": tenant_to_delete.id})

        response = client.delete(url)
        # Depending on the implementation, this could be 204 or 200
        assert response.status_code in [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK]

    def test_tenant_delete_as_owner(self, owner_client):
        """
        Test that tenant owners can delete their own tenant.
        """
        client, user = owner_client
        url = reverse("tenant-detail", kwargs={"pk": user.tenant.id})

        response = client.delete(url)
        # Depending on the implementation, this could be 204 or 200
        assert response.status_code in [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK]

    def test_tenant_delete_as_customer(self, auth_client):
        """
        Test that customers cannot delete tenants.
        """
        client, user = auth_client
        url = reverse("tenant-detail", kwargs={"pk": user.tenant.id})

        response = client.delete(url)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_tenant_verification_status_update(self, admin_client, tenant_factory):
        """
        Test that admin users can update tenant verification status.
        """
        client, _ = admin_client
        tenant = tenant_factory.create(is_verified=False)
        url = reverse("tenant-verification-status", kwargs={"pk": tenant.id})

        response = client.patch(url, {"is_verified": True})
        assert response.status_code == status.HTTP_200_OK
        assert response.data["is_verified"] is True

    def test_tenant_verification_status_update_as_owner(self, owner_client):
        """
        Test that tenant owners cannot update verification status.
        """
        client, user = owner_client
        url = reverse("tenant-verification-status", kwargs={"pk": user.tenant.id})

        response = client.patch(url, {"is_verified": True})
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_nonexistent_tenant(self, admin_client):
        """
        Test handling of nonexistent tenant ID.
        """
        client, _ = admin_client
        url = reverse(
            "tenant-detail", kwargs={"pk": "00000000-0000-0000-0000-000000000000"}
        )
        response = client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND