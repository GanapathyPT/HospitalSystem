from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserType
from .serializer import UserSerializer

class LoginView(APIView):
	def post(self, request, format=None):
		user_name = request.data.get("userName")
		password = request.data.get("password")

		if not user_name or not password:
			return Response({ "status": False }, 
				status=status.HTTP_400_BAD_REQUEST)

		user = authenticate(request, username=user_name, password=password)
		if user is None:
			return Response({ "status": False },
				status=status.HTTP_400_BAD_REQUEST)

		user_type = self.get_user_token(user)

		return Response({ "status": True, "type": user_type },
			status=status.HTTP_200_OK)

	def get_user_token(self, user):
		type_filter = UserType.objects.filter(user=user)
		if not type_filter.exists():
			type_instance = UserType.objects.create(user=user)
			type_instance.save()
			return "D"

		type_instance = type_filter[0]
		return type_instance.type_of_user

class RegisterView(APIView):
	def post(self, request, format=None):
		user_name = request.data.get("userName")
		password = request.data.get("password")
		type_of_user = request.data.get("type")

		if not all([user_name, password, type_of_user]):
			return Response({ "status": False }, 
				status=status.HTTP_400_BAD_REQUEST)

		try:
			user = User.objects.create_user(
				username=user_name, 
				password=password,
			)
			user.save()

			self.update_type_of_user(user, type_of_user)

			return Response({ "status": True },
				status=status.HTTP_200_OK)

		except:
			return Response({ "status": False, "type": "USERNAME" },
				status=status.HTTP_400_BAD_REQUEST)

	def update_type_of_user(self, user, type_of_user):
		type_instance = UserType.objects.create(
			user=user, 
			type_of_user=type_of_user
		)
		type_instance.save()

class GetDoctors(APIView):
	def get(self, request, format=None):
		doctors = []
		user_types = UserType.objects.all()
		for user in user_types:
			if user.type_of_user == "D":
				user_serialized = UserSerializer(user.user)
				doctors.append(user_serialized.data)

		return Response(doctors, status=status.HTTP_200_OK)