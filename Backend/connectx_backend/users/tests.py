from django.test import TestCase
from django.contrib.auth import get_user_model
from tenants.models import Tenant

class UserModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="TestTenant",
            email="tenant@example.com",
            password="tenantpass123"
        )

    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            email="user@example.com",
            password="testpass123",
            name="Test User",
            tenant=self.tenant
        )
        self.assertEqual(user.email, "user@example.com")
        self.assertTrue(user.check_password("testpass123"))
        self.assertEqual(user.tenant, self.tenant)
        self.assertEqual(user.role, User.CUSTOMER)

    def test_create_superuser(self):
        User = get_user_model()
        superuser = User.objects.create_superuser(
            email="admin@example.com",
            password="adminpass123",
            name="Admin User",
            tenant=self.tenant
        )
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertEqual(superuser.role, User.ADMIN)
        self.assertTrue(superuser.check_password("adminpass123"))

    def test_str_representation(self):
        User = get_user_model()
        user = User.objects.create_user(
            email="struser@example.com",
            password="somepass",
            name="String User",
            tenant=self.tenant
        )
        self.assertEqual(str(user), "String User (struser@example.com)")

    def test_password_is_hashed(self):
        User = get_user_model()
        user = User.objects.create_user(
            email="hashuser@example.com",
            password="plainpass",
            name="Hash User",
            tenant=self.tenant
        )
        self.assertNotEqual(user.password, "plainpass")
        self.assertTrue(user.password.startswith("pbkdf2_sha256$"))
