from django.db import models

# Create your models here.

class WTT_User(models.Model):
    userID = models.AutoField(primary_key=True)
    employeeID = models.CharField(max_length=100)
    status = models.CharField(max_length=1)
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    password = models.CharField(max_length=20)
    address = models.CharField(max_length=50)
    driver_license = models.CharField(max_length=10)

class WTT_Truck(models.model):
    truckID = models.AutoField(primary_key=True)
    make_model = models.CharField(max_length=30)
    license_plate = models.CharField(max_length=8)
    odometer = models.IntegerField()
    carrier = models.CharField(max_length=30)
    jurisdiction = models.CharField(max_length=25)

class WTT_Trailer(models.Model):
    trailerID = models.AutoField(primary_key=True)
    make_model = models.CharField(max_length=30)
    license_plate = models.CharField(max_length=8)
    carrier = models.CharField(max_length=30)
    jurisdiction = models.CharField(max_length=25)

class WTT_Log(models.model):
    logID = models.IntegerField()
    userID = models.IntegerField()
    truckID = models.IntegerField()
    trailerID = models.IntegerField()
    trip = models.IntegerField()
    location = models.CharField(max_length=100)
    city = models.CharField(max_length=50)
    load = models.IntegerField()
    height = models.IntegerField()
    defects_en_route = models.CharField(max_length=1000)
    incidents = models.CharField(max_length=1000)
    remarks = models.CharField(max_length=1000)
    pictures = models.CharField(max_length=100)
    declaration = models.IntegerField()
    signature = models.CharField(max_length=100)

class WTT_Log_Inspect_Items(models.Model):
    itemID = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=100)
 
class WTT_Log_Inspect_Det(models.Model):
    logID = models.IntegerField(primary_key=True, foreign_key=True)
    itemID = models.IntegerField(foreign_key=True, primary_key=True)
