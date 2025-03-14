from django.urls import path, include
from .views import *


urlpatterns = [

    # User URLs
    path('user/data/', getUserData, name='get_user_data'),
    path('user/data/me/', getCurUserData, name='get_cur_user_data'),
    path('user/<int:pk>/', getUser, name='get_user'),
    path('user/add/', addUser, name='add_user'),
    path('user/update/<int:pk>/', updateUser, name='update_user'),
    path('user/delete/<int:pk>/', deleteUser, name='delete_user'),

    # Truck URLs
    path('truck/data/', getTruckData, name='get_truck_data'),
    path('truck/<int:pk>/', getTruck, name='get_truck'),
    path('truck/add/', addTruck, name='add_truck'),
    path('truck/update/<int:pk>/', updateTruck, name='update_truck'),
    path('truck/delete/<int:pk>/', deleteTruck, name='delete_truck'),

    # Trailer URLs
    path('trailer/data/', getTrailerData, name='get_trailer_data'),
    path('trailer/<int:pk>/', getTrailer, name='get_trailer'),
    path('trailer/add/', addTrailer, name='add_trailer'),
    path('trailer/update/<int:pk>/', updateTrailer, name='update_trailer'),
    path('trailer/delete/<int:pk>/', deleteTrailer, name='delete_trailer'),

    # Log URLs
    path('log/data/', getLogData, name='get_log_data'),
    path('log/<int:pk>/', getLog, name='get_log'),
    path('log/add/', addLog, name='add_log'),
    path('log/update/<int:pk>/', updateLog, name='update_log'),
    path('log/delete/<int:pk>/', deleteLog, name='delete_log'),

    # Inspection Item URLs
    path('log-inspect-det/add/', addInspectionDetail, name='add_inspection_detail'),

    path('notifications/<int:pk>/read/', markNotificationAsRead, name='mark_notification_read'),

    path('notifications/', getNotifications, name='get_notifications'),
]