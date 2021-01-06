from rest_framework.serializers import ModelSerializer
from .models import Image, Item

class ItemSerializer(ModelSerializer):
	class Meta:
		model = Item
		fields = "__all__"

class ImageSerializer(ModelSerializer):
	class Meta:
		model = Image
		fields = "__all__"