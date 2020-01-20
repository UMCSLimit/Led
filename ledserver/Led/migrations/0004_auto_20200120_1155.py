# Generated by Django 3.0.2 on 2020-01-20 10:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Led', '0003_auto_20200118_1528'),
    ]

    operations = [
        migrations.AlterField(
            model_name='animation',
            name='approved',
            field=models.BooleanField(blank=True, default=False, null=True, verbose_name='Status zatwierdzenia'),
        ),
        migrations.AlterField(
            model_name='animation',
            name='date_approved',
            field=models.DateField(blank=True, null=True, verbose_name='Data zatwierdzenia'),
        ),
    ]