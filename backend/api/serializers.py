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
    truckID = serializers.IntegerField(required=False)
    
    class Meta:
        model = WTT_Truck
        fields = '__all__'

class TrailerSerializer(serializers.ModelSerializer):
    trailerID = serializers.IntegerField(required=False)
    
    class Meta:
        model = WTT_Trailer
        fields = '__all__'

class LogSerializer(serializers.ModelSerializer):
    truck_jurisdiction = serializers.SerializerMethodField()
    trailer_jurisdiction = serializers.SerializerMethodField()
    driver_name = serializers.SerializerMethodField()
    inspection_items = serializers.SerializerMethodField()

    def get_truck_jurisdiction(self, obj):
        from .models import WTT_Truck
        try:
            truck = WTT_Truck.objects.get(truckID=obj.truckID)
            return truck.jurisdiction
        except WTT_Truck.DoesNotExist:
            return None
        
    def get_trailer_jurisdiction(self, obj):
        from .models import WTT_Trailer
        try:
            trailer = WTT_Trailer.objects.get(trailerID=obj.trailerID)
            return trailer.jurisdiction
        except WTT_Trailer.DoesNotExist:
            return None
        
    def get_driver_name(self, obj):
        from .models import WTT_User
        try:
            user = WTT_User.objects.get(employeeID=obj.employeeID)
            return user.first_name,' ', user.last_name
        except WTT_User.DoesNotExist:
            return None

    def get_inspection_items(self, obj):
        from .models import WTT_Log_Inspect_Items, WTT_Log_Inspect_Det
        # Get all items
        all_items = list(WTT_Log_Inspect_Items.objects.all().order_by('itemID'))
        # Get defective items for this log
        defective_ids = set(
            WTT_Log_Inspect_Det.objects.filter(logID=obj)
            .values_list('itemID__itemID', flat=True)
        )
        # Predefined grouping based on itemID (adjust as needed)
        group1_ids = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]
        group2_ids = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
        group3_ids = [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
        trailer_ids = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]

        def serialize_item(item):
            return {
                'itemID': item.itemID,
                'item_name': item.item_name,
                'defective': item.itemID in defective_ids,
            }

        return {
            'truck_items_group1': [serialize_item(i) for i in all_items if i.itemID in group1_ids],
            'truck_items_group2': [serialize_item(i) for i in all_items if i.itemID in group2_ids],
            'truck_items_group3': [serialize_item(i) for i in all_items if i.itemID in group3_ids],
            'trailer_items': [serialize_item(i) for i in all_items if i.itemID in trailer_ids],
        }

    class Meta:
        model = WTT_Log
        fields = '__all__'


class LogInspectItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WTT_Log_Inspect_Items
        fields = '__all__'