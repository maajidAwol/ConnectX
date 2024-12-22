from django.db import migrations, models
import uuid

def populate_uuid_ids(apps, schema_editor):
    StockRequest = apps.get_model('stock_requests', 'StockRequest')
    for stock_request in StockRequest.objects.all():
        stock_request.new_id = uuid.uuid4()
        stock_request.save()

class Migration(migrations.Migration):

    dependencies = [
        ('stock_requests', '0001_initial'),  # Update this with your initial migration file
    ]

    operations = [
        # Step 1: Add a new UUID field
        migrations.AddField(
            model_name='stockrequest',
            name='new_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
        # Step 2: Populate the new UUID field with unique values
        migrations.RunPython(populate_uuid_ids),
        # Step 3: Remove the old BIGINT-based `id` field
        migrations.RemoveField(
            model_name='stockrequest',
            name='id',
        ),
        # Step 4: Rename the `new_id` field to `id`
        migrations.RenameField(
            model_name='stockrequest',
            old_name='new_id',
            new_name='id',
        ),
        # Step 5: Set the `id` field as the primary key
        migrations.AlterField(
            model_name='stockrequest',
            name='id',
            field=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False),
        ),
    ]
