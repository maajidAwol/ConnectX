import os
from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string
from products.models import Product
from tenants.models import Tenant
from users.models import User
from categories.models import Category
from decimal import Decimal


class Command(BaseCommand):
    help = "Create at least 15 mock products with required dependencies or flush them."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete all mock products, mock tenant, user, and category.",
        )

    def handle(self, *args, **options):
        if options.get("flush"):
            # Delete mock products
            deleted_products, _ = Product.objects.filter(
                sku__startswith="MOCKSKU"
            ).delete()
            # Delete mock category
            Category.objects.filter(name="MockCategory").delete()
            # Delete mock user
            User.objects.filter(email="user@example.com").delete()
            # Delete mock tenant
            Tenant.objects.filter(name="MockTenant").delete()
            self.stdout.write(
                self.style.SUCCESS("Flushed all mock products and related mock data.")
            )
            return

        # Ensure at least one tenant
        tenant, _ = Tenant.objects.get_or_create(
            name="string",
            defaults={
                "email": "user@example.com",
                "password": "mockpass123",
            },
        )
        # Ensure at least one owner user
        owner, created = User.objects.get_or_create(
            email="user@example.com",
            defaults={
                "name": "Mock Owner",
                "password": "string",
                "tenant": tenant,
                "role": User.OWNER,
            },
        )
        if created:
            self.stdout.write(
                f"user is not created when tenant create: {owner.password}"
            )
        else:
            self.stdout.write(f"user is created when tenant create: {owner.password}")

        # Ensure at least one category
        category, _ = Category.objects.get_or_create(
            name="MockCategory",
            tenant=tenant,
            defaults={"description": "A mock category."},
        )

        # Create 15 mock products
        for i in range(30):
            sku = f"MOCKSKU{i+1:03d}"
            name = f"Mock Product {i+1}"
            base_price = Decimal("10.00") + i
            profit_percentage = Decimal("20.00")
            quantity = 10 + i
            description = f"This is a mock product number {i+1}."
            cover_url = f"https://example.com/mock_product_{i+1}.jpg"
            product, created = Product.objects.get_or_create(
                sku=sku,
                defaults={
                    "name": name,
                    "base_price": base_price,
                    "profit_percentage": profit_percentage,
                    "quantity": quantity,
                    "category": category,
                    "owner": tenant,
                    "description": description,
                    "cover_url": cover_url,
                    "is_public": i%2,
                    "images": [cover_url],
                    "colors": ["red", "blue"],
                    "sizes": ["S", "M", "L"],
                },
            )
            if created :
                if i%2:
                    product.tenant.set([tenant])  # Correct way for ManyToManyField
                self.stdout.write(self.style.SUCCESS(f"Created product: {name}"))
            else:
                self.stdout.write(f"Product already exists: {name}")
        self.stdout.write(self.style.SUCCESS("Mock product creation complete."))
