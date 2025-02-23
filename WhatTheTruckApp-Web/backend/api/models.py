from django.db import models

# Create your models here.

class WTT_User(models.Model):
    userID = models.AutoField(primary_key=True)
    employeeID = models.CharField(max_length=100)
    status = models.CharField(max_length=1)
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    username = models.CharField(max_length=30)
    password = models.CharField(max_length=20)
    address = models.CharField(max_length=50)
    driver_license = models.CharField(max_length=10)

    class Meta:
        db_table = 'WTT_User' 


class WTT_Truck(models.Model):
    truckID = models.AutoField(primary_key=True)
    make_model = models.CharField(max_length=30)
    license_plate = models.CharField(max_length=8)
    odometer = models.IntegerField()
    carrier = models.CharField(max_length=30)
    jurisdiction = models.CharField(max_length=25)

    class Meta:
        db_table = 'WTT_Truck'

class WTT_Trailer(models.Model):
    trailerID = models.AutoField(primary_key=True)
    make_model = models.CharField(max_length=30)
    license_plate = models.CharField(max_length=8)
    carrier = models.CharField(max_length=30)
    jurisdiction = models.CharField(max_length=25)

    class Meta:
        db_table = 'WTT_Trailer'

class WTT_Log(models.Model):
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

    class Meta:
        db_table = 'WTT_Log'

class WTT_Log_Inspect_Items(models.Model):
    itemID = models.AutoField(primary_key=True)
    item_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'WTT_Log_Inspect_Items'

class WTT_Log_Inspect_Det(models.Model):
    logID = models.ForeignKey('WTT_Log', on_delete=models.CASCADE,primary_key=True)
    itemID = models.ForeignKey('WTT_Log_Inspect_Items', on_delete=models.CASCADE)

    class Meta:
        db_table = 'WTT_Log_Inspect_Det'