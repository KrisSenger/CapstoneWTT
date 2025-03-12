from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import WTT_Log_Inspect_Det, Notification

@receiver(post_save, sender=WTT_Log_Inspect_Det)
def notify_on_inspection_item_added(sender, instance, created, **kwargs):
    if created:
        log = instance.logID  # ForeignKey to WTT_Log
        item = instance.itemID  # ForeignKey to WTT_Log_Inspect_Items
        message = (
            f"Inspection item '{item.item_name}' was added to log #{log.logID} "
            f"by employee #{log.employeeID}."
        )
        Notification.objects.create(message=message, log_id=log.logID)


