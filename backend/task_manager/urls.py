from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterView

router = DefaultRouter()

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
]
