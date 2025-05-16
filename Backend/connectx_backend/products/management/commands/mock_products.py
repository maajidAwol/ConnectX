import os
from django.core.management.base import BaseCommand
from decimal import Decimal
from django.utils.crypto import get_random_string

from products.models import Product, ProductListing
from tenants.models import Tenant
from users.models import User
from categories.models import Category


class Command(BaseCommand):
    help = "Create at least 30 mock products with required dependencies or flush them."

    def add_arguments(self, parser):
        parser.add_argument(
            "--flush",
            action="store_true",
            help="Delete all mock products, mock tenant, user, and category.",
        )

    def handle(self, *args, **options):
        if options.get("flush"):
            ProductListing.objects.all().delete()
            Product.objects.filter(sku__startswith="MOCKSKU").delete()
            Category.objects.filter(name="MockCategory").delete()
            User.objects.filter(email="user@example.com").delete()
            Tenant.objects.filter(name="MockTenant").delete()
            self.stdout.write(
                self.style.SUCCESS("Flushed all mock products and related mock data.")
            )
            return

        tenant, _ = Tenant.objects.get_or_create(
            name="MockTenant",
            defaults={
                "email": "user@example.com",
                "password": "mockpass123",
            },
        )

        owner, created = User.objects.get_or_create(
            email="user@example.com",
            defaults={
                "name": "Mock Owner",
                "password": "string",
                "tenant": tenant,
                "role": User.OWNER,
            },
        )
        owner, created = User.objects.get_or_create(
            email="maajidawol@gmail.com",
            defaults={
                "name": "Mock Owner",
                "password": "password",
                "tenant": tenant,
                "role": User.OWNER,
            },
        )
        if created:
            self.stdout.write(f"user is not created when tenant created: {owner.password}")
        else:
            self.stdout.write(f"user is created when tenant created: {owner.password}")

        category, _ = Category.objects.get_or_create(
            name="MockCategory",
            tenant=tenant,
            defaults={"description": "A mock category."},
        )

        for i in range(30):
            sku = f"MOCKSKU{i+1:03d}"
            name = f"Mock Product {i+1}"
            base_price = Decimal("10.00") + i
            quantity = 10 + i
            description = f"This is a mock product number {i+1}."
            cover_url = f"https://example.com/mock_product_{i+1}.jpg"

            product, created = Product.objects.get_or_create(
                sku=sku,
                defaults={
                    "name": name,
                    "base_price": base_price,
                    "quantity": quantity,
                    "category": category,
                    "owner": tenant,
                    "description": description,
                    "cover_url": cover_url,
                    "is_public": bool(i % 2),
                    "images": [cover_url],
                    "colors": ["red", "blue"],
                    "sizes": ["S", "M", "L"],
                },
            )

            if created:
                if i % 2:
                    ProductListing.objects.get_or_create(product=product, tenant=tenant, 
                        defaults={
                            "profit_percentage": Decimal("10.00")
                        },
                    )
                self.stdout.write(self.style.SUCCESS(f"Created product: {name}"))
            else:
                self.stdout.write(f"Product already exists: {name}")

        self.stdout.write(self.style.SUCCESS("Mock product creation complete."))
