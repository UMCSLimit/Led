from django.contrib import admin

# Register your models here.
from .models import Type, Lang, Animation, Example

admin.site.register(Type)
admin.site.register(Lang)
admin.site.register(Animation)
admin.site.register(Example)