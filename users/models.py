from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserType(models.Model):
	user = models.OneToOneField(to=User, on_delete=models.CASCADE)
	type_of_user = models.CharField(max_length=2, default="D")

	def __str__(self):
		return self.user.username