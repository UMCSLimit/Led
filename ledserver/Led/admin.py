from django.contrib import admin

# Register your models here.
from .models import Type, Lang, Animation

admin.site.register(Type)
admin.site.register(Lang)
admin.site.register(Animation)