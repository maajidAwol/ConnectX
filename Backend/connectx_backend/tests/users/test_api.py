import pytest
from django.urls import reverse
from rest_framework import status
from users.models import User


@pytest.mark.django_db
class TestUserAPI:
    """
    Test suite for User API endpoints.
    """

    @pytest.fixture
    def user_data(self, tenant):
        """Test data for user creation."""
        return {
            "name": "Test User",
            "email": "testuser@example.com",
            "password": "Str0ngP@ssw0rd!2024",
            "role": User.CUSTOMER,
            "tenant": tenant.id,
        }

    @pytest.fixture
    def user_update_data(self):
        """Test data for user update."""
        return {
            "name": "Updated User Name",
            "bio": "This is an updated bio",
            "phone_number": "+1987654321",
        }

    def test_user_list_authenticated(self, auth_client):
        """
        Test that authenticated users can list users in their tenant.
        """
        client, user = auth_client
        url = reverse("user-list")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, dict)
        assert "results" in response.data
        assert len(response.data["results"]) > 0

    def test_user_list_unauthenticated(self, api_client):
        """
        Test that unauthenticated users cannot list users.
        """
        url = reverse("user-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_user_create(self, api_client, user_data):
        """
        Test that users can be created.
        """
        url = reverse("user-list")
        # Remove 'groups' from user_data to prevent direct assignment error
        if "groups" in user_data:
            del user_data["groups"]

        response = api_client.post(url, user_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == user_data["name"]
        assert response.data["email"] == user_data["email"]
        assert response.data["role"] == user_data["role"]
        assert "password" not in response.data  # Password should not be returned

    def test_user_create_invalid_data(self, api_client, tenant):
        """
        Test user creation with invalid data.
        """
        url = reverse("user-list")

        # Missing required fields
        invalid_data = {"name": "Test User"}
        response = api_client.post(url, invalid_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

        # Invalid email format
        invalid_data = {
            "name": "Test User",
            "email": "invalid-email",
            "password": "password123",
            "role": User.CUSTOMER,
            "tenant": tenant.id,
        }
        response = api_client.post(url, invalid_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_user_retrieve(self, auth_client):
        """
        Test that users can be retrieved by ID.
        """
        client, user = auth_client
        url = reverse("user-detail", kwargs={"pk": user.id})
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == str(user.id)
        assert response.data["name"] == user.name
        assert response.data["email"] == user.email

    def test_user_retrieve_different_tenant(self, auth_client, user_factory):
        """
        Test that users cannot retrieve users from different tenants.
        """
        client, _ = auth_client
        other_tenant_user = user_factory.create()  # Creates user with different tenant

        url = reverse("user-detail", kwargs={"pk": other_tenant_user.id})
        response = client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_user_update(self, auth_client, user_update_data):
        """
        Test that users can update their own profile.
        """
        client, user = auth_client
        url = reverse("user-profile-update")

        # Remove tenant from update data since it's not allowed in profile updates
        if "tenant" in user_update_data:
            del user_update_data["tenant"]

        response = client.put(url, user_update_data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == user_update_data["name"]
        assert response.data["bio"] == user_update_data["bio"]
        assert response.data["phone_number"] == user_update_data["phone_number"]

    def test_user_partial_update(self, auth_client):
        """
        Test that users can partially update their profile.
        """
        client, user = auth_client
        url = reverse("user-detail", kwargs={"pk": user.id})
        partial_update_data = {"name": "Partially Updated Name"}

        response = client.patch(url, partial_update_data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == partial_update_data["name"]

    def test_user_delete_not_allowed(self, auth_client):
        """
        Test that regular users cannot delete accounts.
        """
        client, user = auth_client
        url = reverse("user-detail", kwargs={"pk": user.id})

        response = client.delete(url)
        assert response.status_code in [
            status.HTTP_403_FORBIDDEN,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        ]

    def test_admin_can_delete_user(self, admin_client, user_factory):
        """
        Test that admin users can delete other users.
        """
        client, _ = admin_client
        user_to_delete = user_factory.create()
        url = reverse("user-detail", kwargs={"pk": user_to_delete.id})

        response = client.delete(url)
        # Depending on the implementation, this could be 204 or 200
        assert response.status_code in [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK]

    def test_me_endpoint(self, auth_client):
        """
        Test the 'me' endpoint for retrieving the current user.
        """
        client, user = auth_client
        url = reverse("user-me")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == str(user.id)
        assert response.data["name"] == user.name
        assert response.data["email"] == user.email

    def test_me_endpoint_unauthenticated(self, api_client):
        """
        Test that unauthenticated users cannot access the 'me' endpoint.
        """
        url = reverse("user-me")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_profile_endpoint(self, auth_client):
        """
        Test the 'update-profile' endpoint.
        """
        client, user = auth_client
        url = reverse("user-profile-update")
        update_data = {"name": "Updated Profile Name", "bio": "Updated profile bio"}

        response = client.put(url, update_data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == update_data["name"]
        assert response.data["bio"] == update_data["bio"]

    def test_update_profile_not_allowed_for_other_users(
        self, auth_client, user_factory
    ):
        """
        Test users cannot update other users' profiles.
        """
        client, _ = auth_client
        other_user = user_factory.create()

        url = reverse("user-profile-update")
        update_data = {"name": "Attempt to update other user"}

        # Authenticate as a different user and try to update
        response = client.put(url, update_data)

        # Should only update the authenticated user's own profile, not others
        # So the name should not be updated for the other user
        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == update_data["name"]
        # Optionally, check that the other user's name did not change
        other_user.refresh_from_db()
        assert other_user.name != update_data["name"]
