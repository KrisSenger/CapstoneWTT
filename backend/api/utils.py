from .models import WTT_User

def get_driver_name(log):
    """
    Given a log instance, return the driver's full name.
    """
    if log.employee:
        return f"{log.employee.first_name} {log.employee.last_name}"
    return "Unknown Employee"
