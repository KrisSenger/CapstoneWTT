from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from .models import *
from .serializers import *

# User Views
@api_view(['GET'])
@permission_classes([AllowAny])
def getUserData(request):
    users = WTT_User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCurUserData(request):
    curuser = request.user  # Get the current user
    serializer = UserSerializer(curuser)
    return Response(serializer.data)
@api_view(['GET'])
@permission_classes([AllowAny])
def getUser(request, pk):
    try:
        user = WTT_User.objects.get(id=pk)
    except ObjectDoesNotExist:
        return Response({'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def addUser(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def updateUser(request, pk):
    try:
        user = WTT_User.objects.get(id=pk)
    except ObjectDoesNotExist:
        return Response({'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(instance=user, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def deleteUser(request, pk):
    try:
        user = WTT_User.objects.get(id=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    user.delete()
    return Response({'message': 'User successfully deleted!'}, status=status.HTTP_204_NO_CONTENT)


# Truck Views
@api_view(['GET'])
def getTruckData(request):
    truck = WTT_Truck.objects.all()
    serializer = TruckSerializer(truck, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getTruck(request, pk):
    try:
        truck = WTT_Truck.objects.get(truckID=pk)
    except ObjectDoesNotExist:
        return Response({'Truck not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TruckSerializer(truck, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def addTruck(request):
    serializer = TruckSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def updateTruck(request, pk):
    try:
        truck = WTT_Truck.objects.get(truckID=pk)
    except ObjectDoesNotExist:
        return Response({'Truck not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TruckSerializer(instance=truck, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def deleteTruck(request, pk):
    try:
        truck = WTT_Truck.objects.get(truckID=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'Truck not found'}, status=status.HTTP_404_NOT_FOUND)
    
    truck.delete()
    return Response({'message': 'Truck successfully deleted!'}, status=status.HTTP_204_NO_CONTENT)


# Trailer Views
@api_view(['GET'])
def getTrailerData(request):
    trailers = WTT_Trailer.objects.all()
    serializer = TrailerSerializer(trailers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getTrailer(request, pk):
    try:
        trailer = WTT_Trailer.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'Trailer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TrailerSerializer(trailer, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def addTrailer(request):
    serializer = TrailerSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def updateTrailer(request, pk):
    try:
        trailer = WTT_Trailer.objects.get(trailerid=pk)
    except ObjectDoesNotExist:
        return Response({'Trailer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TrailerSerializer(instance=trailer, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def deleteTrailer(request, pk):
    try:
        trailer = WTT_Trailer.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'Trailer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    trailer.delete()
    return Response({'message': 'Trailer successfully deleted!'}, status=status.HTTP_204_NO_CONTENT)


# Log Views
@api_view(['GET'])
@permission_classes([AllowAny])
def getLogData(request):
    logs = WTT_Log.objects.all()
    serializer = LogSerializer(logs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getLog(request, pk):
    try:
        log = WTT_Log.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'Log not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = LogSerializer(log, many=False)
    log_data = serializer.data

    defective_items_qs = WTT_Log_Inspect_Det.objects.filter(logID=log)
    defective_items = []
    for det in defective_items_qs:
        item = det.itemID
        defective_items.append({
            "detailID": det.detailID,
            "itemID": item.itemID,
            "item_name": item.item_name,
        })

    log_data["defective_items"] = defective_items

    return Response(log_data)

@api_view(['POST'])
def addLog(request):
    serializer = LogSerializer(data=request.data)
    if serializer.is_valid():
        log = serializer.save()
        # Trigger a notification if declaration is 0, or defects_en_route/incidents are non-empty.
        if (log.declaration == 0 or 
            (log.defects_en_route and log.defects_en_route.strip()) or 
            (log.incidents and log.incidents.strip())):
            Notification.objects.create(
                message=f"New defective log #{log.logID} submitted by employee #{log.employeeID}."
            )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def updateLog(request, pk):
    try:
        log = WTT_Log.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'Log not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = LogSerializer(instance=log, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def deleteLog(request, pk):
    try:
        log = WTT_Log.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'Log not found'}, status=status.HTTP_404_NOT_FOUND)
    
    log.delete()
    return Response({'message': 'Log successfully deleted!'}, status=status.HTTP_204_NO_CONTENT)


# Log Inspect Items Views
@api_view(['GET'])
def getItemData(request):
    items = WTT_Log_Inspect_Items.objects.all()
    serializer = LogInspectItemsSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getItem(request, pk):
    try:
        item = WTT_Log_Inspect_Items.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = LogInspectItemsSerializer(item, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def addItem(request):
    serializer = LogInspectItemsSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def updateItem(request, pk):
    try:
        item = WTT_Log_Inspect_Items.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = LogInspectItemsSerializer(instance=item, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def deleteItem(request, pk):
    try:
        item = WTT_Log_Inspect_Items.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    item.delete()
    return Response({'message': 'Item successfully deleted!'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def addInspectionDetail(request):
    serializer = LogInspectDetSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def markNotificationAsRead(request, pk):
    try:
        notification = Notification.objects.get(pk=pk)
    except Notification.DoesNotExist:
        return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
    
    notification.read = True
    notification.save()
    serializer = NotificationSerializer(notification)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getNotifications(request):
    if not request.user.is_staff:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
    
    notifications = Notification.objects.filter(read=False).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)
