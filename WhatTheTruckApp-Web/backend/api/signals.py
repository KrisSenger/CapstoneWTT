from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import WTT_Log_Inspect_Det, Notification

@receiver(post_save, sender=WTT_Log_Inspect_Det)
def notify_on_inspection_item_added(sender, instance, created, **kwargs):
    if created:
        # Access the associated log and inspection item
        log = instance.logID  # assuming this is a ForeignKey to WTT_Log
        item = instance.itemID  # assuming this is a ForeignKey to WTT_Log_Inspect_Items
        
        # Build your notification message
        message = (
            f"Inspection item '{item.item_name}' was added to log #{log.logID} "
            f"by employee #{log.employeeID}."
        )
        
        # Create the notification (make sure your Notification model exists)
        Notification.objects.create(message=message)
