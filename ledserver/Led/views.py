from django.http import HttpResponse
from django.http import JsonResponse
from Led.models import Animation
from Led.serializers import AnimationSerializer
#for testing only
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def index(request):
    return HttpResponse("INDEX OF LED")

# Api views
def anim_list(request):
    if request.method == 'GET':
        animations = Animation.objects.all()
        serializer = AnimationSerializer(animations, many=True)
        return JsonResponse(serializer.data, safe=False)
def anim_get(request, id_r):
    if request.method == 'GET':
        animations = Animation.objects.get(id=id_r)
        serializer = AnimationSerializer(animations, many=False)
        return JsonResponse(serializer.data, safe=False)
def anim_post(request):
    if request.method == 'POST':
        serializer = AnimationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if request.method == 'GET':
        return HttpResponse("Error: Only POST is supported.")