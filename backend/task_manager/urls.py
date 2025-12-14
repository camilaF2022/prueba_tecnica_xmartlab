from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import RegisterView, TaskViewSet

router = DefaultRouter()
router.register(r'tasks', viewset=TaskViewSet, basename='task')

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("", include(router.urls)),

]
