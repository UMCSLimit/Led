from django.http import HttpResponse
from django.http import JsonResponse
from Led.models import Animation, Type, Lang, Example
from Led.serializers import AnimationSerializer, TypeSerializer, LangSerializer, AnimationSerializerSave, ExampleSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

#for testing only
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view

# Create your views here.
def index(request):
    return HttpResponse("INDEX OF LED")

# Api views
def anim_random(request):
    if request.method == 'GET':
        random_animation = Animation.get_random()
        serializer = AnimationSerializer(random_animation, many=False, context={'request': request})
        return JsonResponse(serializer.data, safe=False)

def anim_approved(request):
    if request.method == 'GET':
        animations = Animation.objects.filter(approved=True)
        serializer = AnimationSerializer(animations, many=True, context={'request': request})
        return JsonResponse(serializer.data, safe=False)

def anim_examples(request):
    if request.method == 'GET':
        examples = Example.objects.all()
        serializer = ExampleSerializer(examples, many=True, context={'request': request})
        return JsonResponse(serializer.data, safe=False)

def anim_list(request):
    if request.method == 'GET':
        animations = Animation.objects.all().order_by('-date')
        serializer = AnimationSerializer(animations, many=True, context={'request': request})
        return JsonResponse(serializer.data, safe=False)

def anim_get(request, name_requested):
    if request.method == 'GET':
        try:
            animations = Animation.objects.get(name=name_requested)
            serializer = AnimationSerializer(animations, many=False, context={'request': request})
            return JsonResponse(serializer.data, safe=False)
        except Animation.DoesNotExist:
            # todo: determine what response frontend wants
            return HttpResponse("This animation does not exist")
    else:
        return HttpResponse("Error: Only GET is supported")

@api_view(['GET', 'POST'])
@csrf_exempt
# @method_decorator(csrf_exempt, name='dispatch')
def anim_post(request):
    if request.method == 'POST':
        print(request.data)
        serializer = AnimationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'GET':
        return HttpResponse("Error: Only POST is supported.")



class AnimViewSet(viewsets.ModelViewSet):
    queryset = Animation.objects.all()
    serializer_class = AnimationSerializer
class TypeViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows types to be viewed or edited.
    """
    queryset = Type.objects.all()
    serializer_class = TypeSerializer

class LangViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows languages to be viewed or edited.
    """
    queryset = Lang.objects.all()
    serializer_class = LangSerializer