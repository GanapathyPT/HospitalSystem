from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
# from rest_framework.generics import ListAPIView
from .models import Item, Image
from .serializer import ItemSerializer, ImageSerializer

class ListItemsView(APIView):
	def post(self, request, format=None):
		user = request.data.get("user")
		if not user:
			items = Item.objects.all()
			response = self.get_data(items)
			return Response(response,
				status=status.HTTP_200_OK)

		user = User.objects.filter(username=user)
		if not user.exists():
			return Response([], status=status.HTTP_400_BAD_REQUEST)

		user = user[0]

		items = Item.objects.filter(doctor_assigned=user)
		response = self.get_data(items)

		return Response(response,
			status=status.HTTP_200_OK)

	def get_data(self, items):
		serialized_items = ItemSerializer(items, many=True).data
		for index in range(len(items)):
			images = Image.objects.filter(item=items[index])
			serialized_image = ImageSerializer(images, many=True).data
			serialized_items[index]["images"] = serialized_image

		return serialized_items


class AddItemView(APIView):
	def post(self, request, format=None):
		user = request.data.get("userName")
		doctor = request.data.get("doctor")

		patient_name = request.data.get("patientName")
		patient_age = request.data.get("patientAge")
		gender = request.data.get("gender")

		if not all([user, doctor, patient_name, patient_age, gender]):
			return Response({ "status": False }, 
				status=status.HTTP_400_BAD_REQUEST)

		users = User.objects.filter(username=user)
		doctor = User.objects.get(pk=doctor)

		if not users.exists() or not doctor:
			return Response({ "status": False },
				status=status.HTTP_400_BAD_REQUEST)

		user = users[0]

		item = Item.objects.create(
			hospital=user,
			patient_name=patient_name,
			patient_age=patient_age,
			gender=gender,
			doctor_assigned=doctor
		)
		item.save()

		return Response({ "status": True, "id": item.id },
			status=status.HTTP_201_CREATED)

class UploadImage(APIView):
	def post(self, request, format=None):
		item = request.data.get("item")
		image = request.data.get("image")

		try:
			item = Item.objects.get(pk=item)

			new_image = Image(item=item, image=image)
			new_image.save()

			return Response({ "status": True },
				status=status.HTTP_200_OK)
		except:
			return Response({ "status": False },
				status=status.HTTP_400_BAD_REQUEST)

class AddReportView(APIView):
	def post(self, request, format=None):
		item = request.data.get("item")
		report = request.data.get("report")

		if not all([item, report]):
			return Response({ "status": False },
				status=status.HTTP_400_BAD_REQUEST)

		try:
			item = Item.objects.get(pk=item)

			item.report = report
			item.save(update_fields=["report"])

			return Response({ "status": True },
				status=status.HTTP_206_PARTIAL_CONTENT)
		except:
			return Response({ "status": False },
				status=status.HTTP_400_BAD_REQUEST)
