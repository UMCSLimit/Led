from django.contrib.auth.models import User, Group
from rest_framework import serializers
from Led.models import Animation, Lang, Type, Example

class LangSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Lang
        fields = ['lang']

class TypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Type
        fields = ['app']


class AnimationSerializer(serializers.ModelSerializer):
    # lang_name = serializers.CharField(source='id_lang')
    # type_name = serializers.CharField(source='id_type')

    id_lang = LangSerializer()
    id_type = TypeSerializer()

    class Meta:
        model = Animation
        # fields = ['name', 'author', 'date', 'code', 'approved', 'date_approved', 'lang_name', 'type_name']
        # depth = 1
        fields = ['name', 'author', 'description' ,'date', 'code', 'approved', 'date_approved', 'id_lang', 'id_type']
        exclude = []

class ExampleSerializer(serializers.ModelSerializer):
    id_animation = AnimationSerializer()
    class Meta:
        model = Example
        exclude = []
        # fields = ['id_animation']
        # depth = 1

class AnimationSerializerSave(serializers.ModelSerializer):
    class Meta:
        model = Animation
        fields = ['name', 'author', 'date', 'code', 'approved', 'date_approved', 'id_lang', 'id_type']