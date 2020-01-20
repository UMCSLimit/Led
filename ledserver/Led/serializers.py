from django.contrib.auth.models import User, Group
from rest_framework import serializers
from Led.models import Animation, Lang, Type

class LangSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Lang
        fields = ['lang']

class TypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Type
        fields = ['app']


class AnimationSerializer(serializers.ModelSerializer):
    lang_name = serializers.CharField(source='id_lang', read_only=True)
    type_name = serializers.CharField(source='id_type', read_only=True)
    class Meta:
        model = Animation
        fields = ['name', 'author', 'date', 'code', 'approved', 'date_approved', 'lang_name', 'type_name']
        depth = 1