from django.contrib.auth import get_user_model
from tenants.models import Tenant


class TenantUserSignalTest(TestCase):
    def test_user_created_on_tenant_creation(self):
        tenant_email = "tenantuser@example.com"
        tenant = Tenant.objects.create(
            name="TenantWithUser", email=tenant_email, password="tenantpass123"
        )
        User = get_user_model()
        user = User.objects.filter(email=tenant_email, tenant=tenant).first()
        self.assertIsNotNone(user)
        self.assertEqual(user.email, tenant_email)
        self.assertEqual(user.tenant, tenant)
