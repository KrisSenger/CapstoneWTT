from django.urls import path
from .views import *

urlpatterns = [

    # User URLs
    path('api/user/data/', getData, name='get_user_data'),
    path('api/user/<int:pk>/', getUser, name='get_user'),
    path('api/user/add/', addUser, name='add_user'),
    path('api/user/update/<int:pk>/', updateUser, name='update_user'),
    path('api/user/delete/<int:pk>/', deleteUser, name='delete_user'),

    # Truck URLs
    path('api/truck/data/', getData, name='get_truck_data'),
    path('api/truck/<int:pk>/', getTruck, name='get_truck'),
    path('api/truck/add/', addTruck, name='add_truck'),
    path('api/truck/update/<int:pk>/', updateTruck, name='update_truck'),
    path('api/truck/delete/<int:pk>/', deleteTruck, name='delete_truck'),

    # Trailer URLs
    path('api/trailer/data/', getData, name='get_trailer_data'),
    path('api/trailer/<int:pk>/', getTrailer, name='get_trailer'),
    path('api/trailer/add/', addTrailer, name='add_trailer'),
    path('api/trailer/update/<int:pk>/', updateTrailer, name='update_trailer'),
    path('api/trailer/delete/<int:pk>/', deleteTrailer, name='delete_trailer'),

    # Log URLs
    path('api/log/data/', getData, name='get_log_data'),
    path('api/log/<int:pk>/', getLog, name='get_log'),
    path('api/log/add/', addLog, name='add_log'),
    path('api/log/update/<int:pk>/', updateLog, name='update_log'),
    path('api/log/delete/<int:pk>/', deleteLog, name='delete_log'),
    
]