from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from tenants.models import Tenant
from users.models import User


class TenantAPITestCase(APITestCase):
    def setUp(self):
        self.tenant_data = {
            "name": "TestTenant",
            "email": "testtenant@example.com",
            "password": "testpass123",
            "fullname": "Test Owner",
        }
        self.create_url = reverse("tenant-list")
        # Create a tenant and users for permission tests
        self.tenant = Tenant.objects.create(
            name="Tenant1", email="owner@example.com", password="ownerpass"
        )
        self.owner = User.objects.create_user(
            email="owner@example.com",
            password="ownerpass",
            name="Owner",
            tenant=self.tenant,
            role=User.OWNER,
        )
        self.admin = User.objects.create_user(
            email="admin@example.com",
            password="adminpass",
            name="Admin",
            tenant=self.tenant,
            role=User.ADMIN,
            is_staff=True,
            is_superuser=True,
        )
        self.customer = User.objects.create_user(
            email="customer@example.com",
            password="customerpass",
            name="Customer",
            tenant=self.tenant,
            role=User.CUSTOMER,
        )

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_create_tenant_and_user(self):
        response = self.client.post(self.create_url, self.tenant_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        tenant = Tenant.objects.filter(email=self.tenant_data["email"]).first()
        self.assertIsNotNone(tenant)
        user = User.objects.filter(
            email=self.tenant_data["email"], tenant=tenant
        ).first()
        self.assertIsNotNone(user)
        self.assertEqual(user.role, "owner")

    def test_unauthenticated_user_cannot_list_or_retrieve(self):
        response = self.client.get(self.create_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        detail_url = reverse("tenant-detail", args=[self.tenant.id])
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_user_sees_only_own_tenant_in_list(self):
        self.authenticate(self.owner)
        response = self.client.get(self.create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], str(self.owner.tenant.id))

    def test_authenticated_user_can_retrieve_own_tenant(self):
        self.authenticate(self.owner)
        detail_url = reverse("tenant-detail", args=[self.tenant.id])
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], str(self.owner.tenant.id))

    def test_authenticated_user_cannot_retrieve_other_tenant(self):
        # Create another tenant
        other_tenant = Tenant.objects.create(
            name="OtherTenant", email="other@example.com", password="otherpass"
        )
        self.authenticate(self.owner)
        detail_url = reverse("tenant-detail", args=[other_tenant.id])
        response = self.client.get(detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_only_owner_or_admin_can_update_tenant(self):
        update_url = reverse("tenant-detail", args=[self.tenant.id])
        update_data = {"name": "UpdatedTenant"}
        # As owner
        self.authenticate(self.owner)
        response = self.client.patch(update_url, update_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # As admin
        self.authenticate(self.admin)
        response = self.client.patch(update_url, {"name": "AdminUpdate"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # As customer
        self.authenticate(self.customer)
        response = self.client.patch(
            update_url, {"name": "CustomerUpdate"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_only_admin_or_owner_can_delete_tenant(self):
        delete_url = reverse("tenant-detail", args=[self.tenant.id])
        # As admin
        self.authenticate(self.admin)
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Recreate the tenant for further testing
        self.tenant = Tenant.objects.create(
            name="Tenant2", email="owner2@example.com", password="ownerpass2"
        )
        self.owner = User.objects.create_user(
            email="owner2@example.com",
            password="ownerpass2",
            name="Owner2",
            tenant=self.tenant,
            role=User.OWNER,
        )

        # As owner
        self.authenticate(self.owner)
        delete_url = reverse("tenant-detail", args=[self.tenant.id])
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Recreate the tenant for further testing
        self.tenant = Tenant.objects.create(
            name="Tenant3", email="customer@example.com", password="customerpass3"
        )
        self.customer = User.objects.create_user(
            email="customer@example.com",
            password="customerpass3",
            name="Customer3",
            tenant=self.tenant,
            role=User.CUSTOMER,
        )

        # As customer
        self.authenticate(self.customer)
        delete_url = reverse("tenant-detail", args=[self.tenant.id])
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
