from django.contrib.auth.models import User, Group
from rest_framework import serializers
from Led.models import Animation

class AnimationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Animation
        fields = ['name', 'author', 'date', 'code', 'approved', 'date_approved', 'id_lang', 'id_type']
