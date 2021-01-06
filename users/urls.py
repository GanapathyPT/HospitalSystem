from django.urls import path
from .views import LoginView, RegisterView, GetDoctors

urlpatterns = [
    path("login", LoginView.as_view()),
    path("register", RegisterView.as_view()),
    path("doctors", GetDoctors.as_view()),
]
