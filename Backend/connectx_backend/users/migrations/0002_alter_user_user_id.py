from django.db import migrations, models
import uuid

def populate_new_ids(apps, schema_editor):
    User = apps.get_model('users', 'User')
    for user in User.objects.all():
        user.new_user_id = uuid.uuid4()
        user.save()

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),  # Replace with the actual dependency
    ]

    operations = [
        # Step 1: Add a new UUID field
        migrations.AddField(
            model_name='user',
            name='new_user_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
        # Step 2: Populate the new UUID field
        migrations.RunPython(populate_new_ids),
        # Step 3: Remove the old integer field
        migrations.RemoveField(
            model_name='user',
            name='user_id',
        ),
        # Step 4: Rename the new UUID field to the original field name
        migrations.RenameField(
            model_name='user',
            old_name='new_user_id',
            new_name='user_id',
        ),
        # Step 5: Set the UUID field as the primary key
        migrations.AlterField(
            model_name='user',
            name='user_id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False),
        ),
    ]
