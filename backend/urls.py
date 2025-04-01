"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import login_view, DashboardTokenObtainPairView, DriverTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', login_view, name='login'),
    path("api/token/", DashboardTokenObtainPairView.as_view(), name="get_token"),
    path("api/driver/token/", DriverTokenObtainPairView.as_view(), name="driver_get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('api.urls')), 
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

