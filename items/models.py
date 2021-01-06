from django.contrib.auth.models import User
from django.db import models

def nameFile(instance, filename):
	return("/".join(["images", filename]))

class Item(models.Model):
	hospital = models.ForeignKey(to=User, on_delete=models.CASCADE, related_name="hospital")
	patient_name = models.CharField(max_length=100)
	patient_age = models.IntegerField()
	gender = models.CharField(max_length=10)
	scanned_at = models.DateField(auto_now_add=True)
	doctor_assigned = models.ForeignKey(to=User, on_delete=models.CASCADE)
	report = models.TextField(default="No report for the item")

	def __str__(self):
		return self.patient_name

class Image(models.Model):
	item = models.ForeignKey(to=Item, on_delete=models.CASCADE)
	image = models.ImageField(upload_to=nameFile)

	def __str__(self):
		return self.item.patient_name