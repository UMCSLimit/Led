# Generated by Django 3.0.2 on 2020-01-18 14:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Led', '0002_auto_20200118_1526'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animation',
            name='approved',
            field=models.BooleanField(blank=True, default=False, verbose_name='Status zatwierdzenia'),
        ),
        migrations.AlterField(
            model_name='animation',
            name='date_approved',
            field=models.DateField(blank=True, verbose_name='Data zatwierdzenia'),
        ),
    ]
