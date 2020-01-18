from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('animations/<int:id>', views.anim_get),
    path('animations/list', views.anim_list),
    path('animations/post', views.anim_post),
]