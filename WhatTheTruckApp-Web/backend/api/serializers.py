from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = WTT_User
        fields = '__all__'
        extra_kwargs = {"password": {"write_only": True, "required": True}}
    
    def create(self, validated_data):
        user = WTT_User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],    
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            employeeID=validated_data.get('employeeID', ''),
            status=validated_data.get('status', ''),
            address=validated_data.get('address', ''),
            driver_license=validated_data.get('driver_license', '')
        )
        return user

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