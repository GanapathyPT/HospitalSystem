from django.urls import path
from .views import *

urlpatterns = [
    path("list", ListItemsView.as_view()),
    path("add", AddItemView.as_view()),
    path("upload-image", UploadImage.as_view()),
    path("add-report", AddReportView.as_view()),
]
