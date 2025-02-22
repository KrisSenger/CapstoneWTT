from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = WTT_User
        fields = '__all__'
        extra_kwargs = {"password": {"write_only": True, "required": True}}

class TruckSerializer(serializers.ModelSerializer):
    class Meta:
        model = WTT_Truck
        fields = '__all__'

class TrailerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WTT_Trailer
        fields = '__all__'

class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = WTT_Log
        fields = '__all__'

class LogInspectItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WTT_Log_Inspect_Items
        fields = '__all__'