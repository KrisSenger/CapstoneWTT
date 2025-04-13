from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from datetime import datetime
from api.storages_backends import MediaStorage

# Create your models here.

class WTT_UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(username, email, password, **extra_fields)

class WTT_User(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    employeeID = models.CharField(max_length=6, unique=True)
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    email = models.EmailField(max_length=100, unique=True)
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=128)
    address = models.CharField(max_length=128)
    driver_license = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = WTT_UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'employeeID']

    class Meta:
        db_table = 'WTT_User'

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name


class WTT_Truck(models.Model):
    truckID = models.IntegerField(primary_key=True)
    make_model = models.CharField(max_length=60)
    license_plate = models.CharField(max_length=8)
    odometer = models.IntegerField()
    carrier = models.CharField(max_length=60)
    jurisdiction = models.CharField(max_length=60)
    in_service = models.BooleanField(default=True)

    class Meta:
        db_table = 'WTT_Truck'


class WTT_Trailer(models.Model):
    trailerID = models.IntegerField(primary_key=True)
    make_model = models.CharField(max_length=60)
    license_plate = models.CharField(max_length=8)
    carrier = models.CharField(max_length=60)
    jurisdiction = models.CharField(max_length=60)
    in_service = models.BooleanField(default=True)

    class Meta:
        db_table = 'WTT_Trailer'


class WTT_Log(models.Model):
    logID = models.AutoField(primary_key=True)
    employee = models.ForeignKey(
        WTT_User,
        on_delete=models.CASCADE,
        db_column='employeeID',
        to_field='employeeID'  # this tells Django to use the WTT_User.employeeID field for lookups
    )
    truck = models.ForeignKey(WTT_Truck, on_delete=models.CASCADE, db_column='truckID')
    trailer = models.ForeignKey(WTT_Trailer, on_delete=models.CASCADE, null=True, blank=True, db_column='trailerID')
    trip = models.IntegerField()
    location = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    date = models.DateTimeField(default=datetime.now, blank=True)
    load = models.IntegerField(null=True)
    height = models.IntegerField(null=True)
    defects_en_route = models.CharField(max_length=1000, null=True)
    incidents = models.CharField(max_length=1000, null=True)
    remarks = models.CharField(max_length=1000, null=True)
    declaration = models.IntegerField()
    signature = models.CharField(max_length=100)

    class Meta:
        db_table = 'WTT_Log'


class WTT_Log_Inspect_Items(models.Model):
    itemID = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'WTT_Log_Inspect_Items'


class WTT_Log_Inspect_Det(models.Model):
    detailID = models.AutoField(primary_key=True, null=False)
    logID = models.ForeignKey('WTT_Log', on_delete=models.CASCADE, db_column='logID')
    itemID = models.ForeignKey('WTT_Log_Inspect_Items', on_delete=models.CASCADE, db_column='itemID')

    class Meta:
        db_table = 'WTT_Log_Inspect_Det'


class WTT_Log_Pictures(models.Model):
    logpicID = models.AutoField(primary_key=True, null=False)
    logID = models.ForeignKey(
        'WTT_Log',
        on_delete=models.CASCADE,
        db_column='logID',
        related_name='pictures'  # use log_instance.pictures.all()
    )
    picture = models.ImageField(upload_to='log_images/', storage=MediaStorage())

    class Meta:
        db_table = 'WTT_Log_Pictures'


class WTT_Srs_Incident(models.Model):
    incidentID = models.AutoField(primary_key=True)
    employee = models.ForeignKey(
        WTT_User,
        on_delete=models.CASCADE,
        db_column='employeeID',
        to_field='employeeID'
    )

    truck = models.ForeignKey(WTT_Truck, on_delete=models.CASCADE, db_column='truckID')
    trailer = models.ForeignKey(WTT_Trailer, on_delete=models.CASCADE, null=True, blank=True, db_column='trailerID')
    date = models.DateTimeField(default=datetime.now, blank=True)
    summary = models.CharField(max_length=1000, null=True)

    class Meta:
        db_table = 'WTT_Srs_Incident'


class WTT_Srs_Inc_Pictures(models.Model):
    srsincpicID = models.AutoField(primary_key=True, null=False)
    incidentID = models.ForeignKey(
        'WTT_Srs_Incident',
        on_delete=models.CASCADE,
        db_column='incidentID',
        related_name='pictures'  # Access via incident_instance.pictures.all()
    )
    picture = models.ImageField(upload_to='srs_incidents_images/', storage=MediaStorage())

    class Meta:
        db_table = 'WTT_Srs_Inc_Pictures'


class Notification(models.Model):
    id = models.AutoField(primary_key=True)
    message = models.CharField(max_length=255)
    log_id = models.IntegerField(null=True, blank=True)
    incident_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.message} ({self.created_at})"




