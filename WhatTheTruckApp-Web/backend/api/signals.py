from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import *
from .utils import get_driver_name

def get_driver_name(log):
    try:
        user = WTT_User.objects.get(employeeID=log.employeeID)
        return f"{user.first_name} {user.last_name}"
    except WTT_User.DoesNotExist:
        return f"Employee #{log.employeeID}"

@receiver(post_save, sender=WTT_Log_Inspect_Det)
def notify_on_inspection_item_added(sender, instance, created, **kwargs):
    if created:
        log = instance.logID  # ForeignKey to WTT_Log
        item = instance.itemID  # ForeignKey to WTT_Log_Inspect_Items
        driver_name = get_driver_name(log)
        message = (
            f"Inspection item '{item.item_name}' added to log #{log.logID} "
            f"by {driver_name}."
        )
        Notification.objects.create(message=message, log_id=log.logID)
