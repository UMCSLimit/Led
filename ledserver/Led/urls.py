from django.urls import path, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'animlist', views.AnimViewSet)
router.register(r'typelist', views.TypeViewSet)
router.register(r'langlist', views.LangViewSet)

urlpatterns = [
    path('', views.index, name='index'),
    path('animations/list', views.anim_list),
    path('animations/post', views.anim_post),
    path('animations/<str:name_requested>', views.anim_get),
    path('', include(router.urls)),
]