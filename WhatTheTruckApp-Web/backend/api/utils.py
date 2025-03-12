from .models import WTT_User

def get_driver_name(log):
    """
    Given a log instance, return the driver's full name.
    """
    try:
        user = WTT_User.objects.get(employeeID=log.employeeID)
        return f"{user.first_name} {user.last_name}"
    except WTT_User.DoesNotExist:
        return None
