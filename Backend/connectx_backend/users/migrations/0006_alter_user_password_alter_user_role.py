# Generated by Django 5.1.3 on 2024-12-18 06:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_alter_user_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=128),
        ),
        migrations.AlterField(
            model_name='user',
            name='role',
            field=models.CharField(choices=[('admin', 'Admin'), ('entrepreneur', 'Entrepreneur'), ('customer', 'Customer'), ('owner', 'Owner')], default='customer', max_length=50),
        ),
    ]
