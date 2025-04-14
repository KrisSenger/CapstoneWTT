from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *
from .utils import get_driver_name

def get_driver_name(log):
    try:
        user = log.employee
        return f"{user.first_name} {user.last_name}"
    except AttributeError:

        return "Unknown Employee"


# Uncomment to turn on individual notifications for inspection items
@receiver(post_save, sender=WTT_Log_Inspect_Det)
def notify_on_inspection_item_added(sender, instance, created, **kwargs):
    if created:
        log = instance.logID
        if not Notification.objects.filter(log_id=log.logID, message__icontains="Inspection item").exists():
            driver_name = get_driver_name(log)
            message = f"Inspection item added to log #{log.logID} by driver {driver_name}."
            Notification.objects.create(message=message, log_id=log.logID)


@receiver(post_save, sender=WTT_Srs_Incident)
def notify_on_incident_added(sender, instance, created, **kwargs):
    if created:
        truck = instance.truck
        driver_name = get_driver_name(instance)
        message = (
            f"Incident #{instance.incidentID} involving truck {truck.truckID} "
            f"reported by {driver_name}."
        )
        Notification.objects.create(message=message, incident_id=instance.incidentID)
