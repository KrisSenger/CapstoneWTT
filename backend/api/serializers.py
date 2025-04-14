from rest_framework import serializers
from .models import *
from rest_framework.validators import UniqueValidator
# from .utils import get_driver_name

class UserSerializer(serializers.ModelSerializer):
    employeeID = serializers.CharField(
        validators=[UniqueValidator(
            queryset=WTT_User.objects.all(),
            message="A user with that employeeID already exists."
        )]
    )
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=WTT_User.objects.all(),
            message="A user with that email already exists."
        )]
    )
    username = serializers.CharField(
        validators=[UniqueValidator(
            queryset=WTT_User.objects.all(),
            message="A user with that username already exists."
        )]
    )
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
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }

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
            driver_license=validated_data.get('driver_license'),
            is_staff=validated_data.get('is_staff', False),
            is_active=validated_data.get('is_active', True)
        )
        return WTT_User.objects.create_user(
        username=validated_data['username'],
        email=validated_data['email'],
        password=validated_data.get('password'),
        employeeID=validated_data.get('employeeID'),
        first_name=validated_data.get('first_name'),
        last_name=validated_data.get('last_name'),
        address=validated_data.get('address'),
        driver_license=validated_data.get('driver_license'),
        is_staff=validated_data.get('is_staff', False),
        is_active=validated_data.get('is_active', True)
    )

    def update(self, instance, validated_data):
        validated_data.pop('employeeID', None)
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


class LogPicturesSerializer(serializers.ModelSerializer):
    logID = serializers.PrimaryKeyRelatedField(queryset=WTT_Log.objects.all())
    class Meta: 
        model = WTT_Log_Pictures
        fields = ['logpicID', 'logID', 'picture']


class LogSerializer(serializers.ModelSerializer):
    # Use SlugRelatedField so that incoming/outgoing values are based on the employeeID field
    employeeID = serializers.SlugRelatedField(
        slug_field="employeeID",
        queryset=WTT_User.objects.all(),
        source="employee"
    )

    truckID = serializers.PrimaryKeyRelatedField(
        queryset=WTT_Truck.objects.all(), source="truck"
    )
    trailerID = serializers.PrimaryKeyRelatedField(
        queryset=WTT_Trailer.objects.all(),
        source="trailer",
        required=False,
        allow_null=True
    )
    truck_jurisdiction = serializers.SerializerMethodField()
    trailer_jurisdiction = serializers.SerializerMethodField()
    driver_name = serializers.SerializerMethodField()
    inspection_items = serializers.SerializerMethodField()
    any_defects = serializers.SerializerMethodField()
    pictures = LogPicturesSerializer(many=True, read_only=True)

    def get_truck_jurisdiction(self, obj):
        return obj.truck.jurisdiction if obj.truck else None

    def get_trailer_jurisdiction(self, obj):
        return obj.trailer.jurisdiction if obj.trailer else None

    def get_driver_name(self, obj):
        if obj.employee:
            return f"{obj.employee.first_name} {obj.employee.last_name}"
        return None

    def get_inspection_items(self, obj):
        from .models import WTT_Log_Inspect_Items, WTT_Log_Inspect_Det
        all_items = list(WTT_Log_Inspect_Items.objects.all().order_by('itemID'))
        defective_ids = set(
            WTT_Log_Inspect_Det.objects.filter(logID=obj)
            .values_list('itemID__itemID', flat=True)
        )
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

    def get_any_defects(self, obj):
        items = self.get_inspection_items(obj)
        all_items = (
            items.get('truck_items_group1', []) +
            items.get('truck_items_group2', []) +
            items.get('truck_items_group3', []) +
            items.get('trailer_items', [])
        )
        return any(item['defective'] for item in all_items)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        
        print("rep is being printed")
        print(rep)
        rep['employeeID'] = rep.pop('employee', rep.get('employeeID'))
        return rep

    class Meta:
        model = WTT_Log
        fields = [
            'logID', 'employeeID', 'truckID', 'trailerID', 'trip', 'location',
            'city', 'date', 'load', 'height', 'defects_en_route', 'incidents',
            'remarks', 'declaration', 'signature',
            'truck_jurisdiction', 'trailer_jurisdiction', 'driver_name',
            'inspection_items', 'any_defects', 'pictures'
        ]
        read_only_fields = ['logID']


class LogInspectItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WTT_Log_Inspect_Items
        fields = '__all__'
        

class LogInspectDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = WTT_Log_Inspect_Det
        fields = '__all__'


class IncidentPicturesSerializer(serializers.ModelSerializer):
    incidentID = serializers.PrimaryKeyRelatedField(queryset=WTT_Srs_Incident.objects.all())

    class Meta:
        model = WTT_Srs_Inc_Pictures
        fields = ['srsincpicID', 'picture', 'incidentID']


class IncidentSerializer(serializers.ModelSerializer):
    employeeID = serializers.SlugRelatedField(
        queryset=WTT_User.objects.all(),
        slug_field="employeeID",
        source="employee"
    )
    truckID = serializers.PrimaryKeyRelatedField(
        queryset=WTT_Truck.objects.all(), source="truck"
    )
    trailerID = serializers.PrimaryKeyRelatedField(
        queryset=WTT_Trailer.objects.all(),
        source="trailer",
        allow_null=True,
        required=False
    )
    pictures = IncidentPicturesSerializer(many=True, read_only=True)

    class Meta:
        model = WTT_Srs_Incident
        fields = ['incidentID', 'employeeID', 'truckID', 'trailerID', 'date', 'summary', 'pictures']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class ArchiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = WTT_Archive
        fields = '__all__'

class ArchiveDetSerializer(serializers.ModelSerializer):
    class Meta:
        model = WTT_Archive_Det
        fields = '__all__'