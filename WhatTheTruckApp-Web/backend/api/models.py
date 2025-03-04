from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from datetime import datetime

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
    employeeID = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    email = models.EmailField(max_length=100, unique=True)
    username = models.CharField(max_length=30, unique=True)
    password = models.CharField(max_length=128)
    address = models.CharField(max_length=128)
    driver_license = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    objects = WTT_UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'WTT_User'



class WTT_Truck(models.Model):
    truckID = models.IntegerField(primary_key=True)
    make_model = models.CharField(max_length=60)
    license_plate = models.CharField(max_length=8)
    odometer = models.IntegerField()
    carrier = models.CharField(max_length=30)
    jurisdiction = models.CharField(max_length=25)

    class Meta:
        db_table = 'WTT_Truck'

class WTT_Trailer(models.Model):
    trailerID = models.IntegerField(primary_key=True)
    make_model = models.CharField(max_length=60)
    license_plate = models.CharField(max_length=8)
    carrier = models.CharField(max_length=30)
    jurisdiction = models.CharField(max_length=25)

    class Meta:
        db_table = 'WTT_Trailer'

class WTT_Log(models.Model):
    logID = models.IntegerField(primary_key=True)
    employeeID = models.IntegerField()
    truckID = models.IntegerField()
    trailerID = models.IntegerField(null=True)
    trip = models.IntegerField()
    location = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    date = models.DateTimeField(default=datetime.now, blank=True)
    load = models.IntegerField()
    height = models.IntegerField()
    defects_en_route = models.CharField(max_length=1000)
    incidents = models.CharField(max_length=1000)
    remarks = models.CharField(max_length=1000)
    pictures = models.CharField(max_length=100)
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
    logID = models.ForeignKey('WTT_Log', on_delete=models.CASCADE, primary_key=True, db_column='logID')
    itemID = models.ForeignKey('WTT_Log_Inspect_Items', on_delete=models.CASCADE, db_column='itemID')

    class Meta:
        db_table = 'WTT_Log_Inspect_Det'
