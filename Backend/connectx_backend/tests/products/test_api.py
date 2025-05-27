import pytest
import uuid
from django.urls import reverse
from rest_framework import status
from products.models import Product, ProductListing


@pytest.mark.django_db
class TestProductAPI:
    """
    Test suite for Product API endpoints.
    """

    @pytest.fixture
    def category(self, category_factory, tenant):
        """Create a test category."""
        return category_factory.create(tenant=tenant)

    @pytest.fixture
    def product_data(self, category):
        """Test data for product creation."""
        return {
            "name": "Test Product",
            "description": "Test product description",
            "base_price": "100.00",
            "category_id": str(category.id),
            "is_public": True,
            "sku": "TEST-123",
        }

    @pytest.fixture
    def product_update_data(self, category):
        """Test data for product update."""
        return {
            "name": "Updated Product Name",
            "base_price": "110.00",
            "description": "Updated product description",
            "is_public": False,
            "category_id": str(category.id),
            "sku": f"SKU-{uuid.uuid4()}",
        }

    def test_product_list_authenticated(self, auth_client, product_factory):
        """
        Test that authenticated users can list products.
        """
        client, user = auth_client
        # Create a product for the user's tenant
        product_factory.create(tenant=user.tenant)

        url = reverse("product-list")
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, dict)
        assert "results" in response.data
        # We should at least see the product we just created
        assert len(response.data["results"]) > 0

    def test_product_list_unauthenticated(self, api_client):
        """
        Test that unauthenticated users cannot list products.
        """
        url = reverse("product-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_product_list_filter_by_category(
        self, auth_client, product_factory, category_factory
    ):
        """
        Test filtering products by category.
        """
        client, user = auth_client
        category = category_factory.create(tenant=user.tenant)
        # Create a product with this category
        product_factory.create(tenant=user.tenant, category=category)

        url = f"{reverse('product-list')}?category={category.name}"
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) > 0
        assert all(
            product["category"]["name"] == category.name
            for product in response.data["results"]
        )

    def test_product_create_as_owner(self, owner_client, product_data):
        """
        Test that tenant owners can create products.
        """
        client, owner = owner_client
        url = reverse("product-list")
        response = client.post(url, product_data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == product_data["name"]
        assert float(response.data["base_price"]) == float(product_data["base_price"])
        assert response.data["is_public"] == product_data["is_public"]

    def test_product_create_as_customer(self, auth_client, product_data):
        """
        Test that regular customers cannot create products.
        """
        client, _ = auth_client
        url = reverse("product-list")
        response = client.post(url, product_data)

        # Regular customers should not be able to create products
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_product_create_invalid_data(self, owner_client, category):
        """
        Test product creation with invalid data.
        """
        client, _ = owner_client
        url = reverse("product-list")

        # Missing required fields
        invalid_data = {
            "name": "Test Product"
            # Missing sku, category, etc.
        }
        response = client.post(url, invalid_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

        # Invalid price format
        invalid_data = {
            "sku": f"SKU-{uuid.uuid4()}",
            "name": "Test Product",
            "base_price": "not-a-number",
            "category_id": str(category.id),
        }
        response = client.post(url, invalid_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_product_retrieve(self, auth_client, product_factory):
        """
        Test that products can be retrieved by ID.
        """
        client, user = auth_client
        product = product_factory.create(tenant=user.tenant)

        url = reverse("product-detail", kwargs={"pk": product.id})
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == str(product.id)
        assert response.data["name"] == product.name
        assert float(response.data["base_price"]) == float(product.base_price)

    def test_product_retrieve_different_tenant_public(
        self, auth_client, product_factory, tenant_factory
    ):
        """
        Test that users can retrieve public products from different tenants.
        """
        client, _ = auth_client
        other_tenant = tenant_factory.create()
        public_product = product_factory.create(tenant=other_tenant, is_public=True)

        url = reverse("product-detail", kwargs={"pk": public_product.id})
        response = client.get(url)

        # Public products should be accessible
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == str(public_product.id)

    def test_product_retrieve_different_tenant_private(
        self, auth_client, product_factory, tenant_factory
    ):
        """
        Test that users cannot retrieve private products from different tenants.
        """
        client, _ = auth_client
        other_tenant = tenant_factory.create()
        private_product = product_factory.create(tenant=other_tenant, is_public=False)

        url = reverse("product-detail", kwargs={"pk": private_product.id})
        response = client.get(url)

        # Private products from other tenants should not be accessible
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_product_update_as_owner(
        self, owner_client, product_factory, product_update_data
    ):
        """
        Test that tenant owners can update their products.
        """
        client, owner = owner_client
        product = product_factory.create(tenant=owner.tenant)

        url = reverse("product-detail", kwargs={"pk": product.id})
        response = client.put(url, product_update_data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == product_update_data["name"]
        assert float(response.data["base_price"]) == float(
            product_update_data["base_price"]
        )
        assert response.data["is_public"] == product_update_data["is_public"]

    def test_product_partial_update(self, owner_client, product_factory):
        """
        Test that tenant owners can partially update their products.
        """
        client, owner = owner_client
        product = product_factory.create(tenant=owner.tenant)

        url = reverse("product-detail", kwargs={"pk": product.id})
        update_data = {"name": "Updated Name Only"}
        response = client.patch(url, update_data)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == update_data["name"]

    def test_product_delete(self, owner_client, product_factory):
        """
        Test that tenant owners can delete their products.
        """
        client, owner = owner_client
        product = product_factory.create(tenant=owner.tenant)

        url = reverse("product-detail", kwargs={"pk": product.id})
        response = client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Product.objects.filter(id=product.id).exists()

    def test_customer_cannot_delete_product(self, auth_client, product_factory):
        """
        Test that regular customers cannot delete products.
        """
        client, user = auth_client
        product = product_factory.create(tenant=user.tenant)

        url = reverse("product-detail", kwargs={"pk": product.id})
        response = client.delete(url)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert Product.objects.filter(id=product.id).exists()

    def test_by_category_endpoint(self, auth_client, product_factory, category_factory):
        """
        Test the by-category endpoint.
        """
        client, user = auth_client
        category = category_factory.create(tenant=user.tenant)
        product = product_factory.create(tenant=user.tenant, category=category)

        url = reverse("product-by-category", kwargs={"category_id": category.id})
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) > 0
        assert response.data["results"][0]["id"] == str(product.id)

    def test_list_to_tenant_endpoint(
        self, auth_client, product_factory, tenant_factory
    ):
        """
        Test listing a product to a tenant.
        """
        client, user = auth_client
        other_tenant = tenant_factory.create()
        product = product_factory.create(tenant=other_tenant, is_public=True)

        url = reverse("product-list-to-tenant", kwargs={"pk": product.id})
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert ProductListing.objects.filter(
            product=product, tenant=user.tenant
        ).exists()

    def test_unlist_from_tenant_endpoint(self, auth_client, product_factory):
        """
        Test unlisting a product from a tenant.
        """
        client, user = auth_client
        product = product_factory.create(tenant=user.tenant)
        # Delete any existing listings first
        ProductListing.objects.filter(product=product, tenant=user.tenant).delete()
        # Create a new listing
        ProductListing.objects.create(product=product, tenant=user.tenant)

        url = reverse("product-unlist-from-tenant", kwargs={"pk": product.id})
        response = client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert not ProductListing.objects.filter(
            product=product, tenant=user.tenant
        ).exists()

    def test_nonexistent_product(self, auth_client):
        """
        Test retrieving a nonexistent product.
        """
        client, _ = auth_client
        url = reverse("product-detail", kwargs={"pk": uuid.uuid4()})
        response = client.get(url)

        assert response.status_code == status.HTTP_404_NOT_FOUND