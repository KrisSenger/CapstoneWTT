from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    is_superuser = serializers.BooleanField(required=False)
    is_active = serializers.BooleanField(required=False)
    is_staff = serializers.BooleanField(required=False)

    class Meta:
        model = WTT_User
        fields = [
            'id', 'employeeID', 'first_name', 'last_name', 'email',
            'username', 'password', 'address', 'driver_license',
            'is_superuser', 'is_active', 'is_staff'
        ]
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        if validated_data.get('is_superuser', False):
            return WTT_User.objects.create_superuser(
                username=validated_data['username'],
                email=validated_data['email'],
                password=validated_data.get('password'),
                employeeID=validated_data.get('employeeID'),
                first_name=validated_data.get('first_name'),
                last_name=validated_data.get('last_name'),
                address=validated_data.get('address'),
                driver_license=validated_data.get('driver_license')
            )
        return WTT_User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data.get('password'),
            employeeID=validated_data.get('employeeID'),
            first_name=validated_data.get('first_name'),
            last_name=validated_data.get('last_name'),
            address=validated_data.get('address'),
            driver_license=validated_data.get('driver_license')
        )

    def update(self, instance, validated_data):
        # Pop the password if provided; if not provided, we don't update it.
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


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