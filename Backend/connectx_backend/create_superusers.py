from django.contrib.auth.models import User
from django.db import migrations
def create_superusers():
    superusers = [
        {"username": "adane", "email": "admin1@example.com", "password": "1234"},
        {"username": "majid", "email": "admin2@example.com", "password": "1234"},
        {"username": "amanuel", "email": "admin3@example.com", "password": "1234"},
        {"username": "elias", "email": "admin3@example.com", "password": "1234"},
        {"username": "abel", "email": "admin3@example.com", "password": "1234"},
    ]

    for user_data in superusers:
        if not User.objects.filter(username=user_data["username"]).exists():
            User.objects.create_superuser(
                username=user_data["username"],
                email=user_data["email"],
                password=user_data["password"],
            )
            print(f"Superuser {user_data['username']} created successfully.")
        else:
            print(f"Superuser {user_data['username']} already exists.")
class Migration(migrations.Migration):

    dependencies = [
        ('connectx', 'previous_migration'),
    ]

    operations = [
        migrations.RunPython(create_superusers),
    ]