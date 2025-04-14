from django.shortcuts import render, redirect
from django.views import View
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status, serializers
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.exceptions import ObjectDoesNotExist
from .models import *
from .serializers import *
from django.db import IntegrityError
from .utils import get_driver_name
from functools import wraps
from google.cloud import documentai_v1 as documentai
from dotenv import load_dotenv
from .forms import *
import os

load_dotenv()

def login_view(request):
    return render(request, 'Login.jsx')


def supervisor_required(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated or not (request.user.is_active and request.user.is_staff):
            return Response(
                {"error": "Not authorized. Only active supervisors can perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )
        return func(request, *args, **kwargs)
    return wrapper


# Serializer and view for supervisor dashboard login
class DashboardTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_active or not self.user.is_staff:
            raise serializers.ValidationError("Not authorized. Only active supervisors can log in.")
        return data


class DashboardTokenObtainPairView(TokenObtainPairView):
    serializer_class = DashboardTokenObtainPairSerializer


# Serializer and view for driver login
class DriverTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_active:
            raise serializers.ValidationError("User is not active.")
        return data


class DriverTokenObtainPairView(TokenObtainPairView):
    serializer_class = DriverTokenObtainPairSerializer


# User Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def getUser(request, pk):
    try:
        user = WTT_User.objects.get(id=pk)
    except ObjectDoesNotExist:
        return Response({'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@supervisor_required
def addUser(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
        except IntegrityError as e:
            # Customize the error message for duplicate employeeID
            return Response(
                {"employeeID": ["A user with that employeeID already exists."]},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"message": "User added successfully!", "user": serializer.data},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@supervisor_required
def updateUser(request, pk):
    try:
        user = WTT_User.objects.get(id=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
        # Prevent a non‑superuser staff member from modifying a superuser's critical attributes
    if request.user.is_staff and not request.user.is_superuser:
        # Disallow any password change when the target user is a superuser.
        if user.is_superuser and 'password' in request.data:
            return Response(
                {"error": "You are not authorized to change the password of a superuser."},
                status=status.HTTP_403_FORBIDDEN
            )
        
    if request.user.is_staff and not request.user.is_superuser:
        if 'is_superuser' in request.data:
            if request.data['is_superuser'] != user.is_superuser:
                return Response(
                    {"error": "Changing Superuser status prohibited."},
                    status=status.HTTP_403_FORBIDDEN
                )
    
    if request.user.id == user.id:
        if 'is_active' in request.data and request.data['is_active'] is False:
            return Response(
                {"error": "You cannot deactivate yourself."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    serializer = UserSerializer(instance=user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@supervisor_required
def deleteUser(request, pk):
    try:
        user = WTT_User.objects.get(id=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if user.is_superuser:
        return Response({"error": "Cannot delete Superuser Admin"}, status=status.HTTP_403_FORBIDDEN)
    
    user.delete()
    return Response({'message': 'User successfully deleted!'}, status=status.HTTP_204_NO_CONTENT)


# Truck Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTruckData(request):
    truck = WTT_Truck.objects.all()
    serializer = TruckSerializer(truck, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTruck(request, pk):
    try:
        truck = WTT_Truck.objects.get(truckID=pk)
    except ObjectDoesNotExist:
        return Response({'Truck not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TruckSerializer(truck, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@supervisor_required
def addTruck(request):
    serializer = TruckSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
@supervisor_required
def deleteTruck(request, pk):
    try:
        truck = WTT_Truck.objects.get(truckID=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'Truck not found'}, status=status.HTTP_404_NOT_FOUND)
    
    truck.delete()
    return Response({'message': 'Truck successfully deleted!'}, status=status.HTTP_204_NO_CONTENT)


# Trailer Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTrailerData(request):
    trailers = WTT_Trailer.objects.all()
    serializer = TrailerSerializer(trailers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTrailer(request, pk):
    try:
        trailer = WTT_Trailer.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'Trailer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TrailerSerializer(trailer, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@supervisor_required
def addTrailer(request):
    serializer = TrailerSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@supervisor_required
def updateTrailer(request, pk):
    try:
        trailer = WTT_Trailer.objects.get(trailerID=pk)
    except ObjectDoesNotExist:
        return Response({'Trailer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TrailerSerializer(instance=trailer, data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@supervisor_required
def deleteTrailer(request, pk):
    try:
        trailer = WTT_Trailer.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'Trailer not found'}, status=status.HTTP_404_NOT_FOUND)
    
    trailer.delete()
    return Response({'message': 'Trailer successfully deleted!'}, status=status.HTTP_204_NO_CONTENT)


# Log Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@permission_classes([AllowAny])
def getLogData(request):
    logs = WTT_Log.objects.select_related('truck', 'trailer', 'employee').all()
    serializer = LogSerializer(logs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def addLog(request):
    serializer = LogSerializer(data=request.data)
    if serializer.is_valid():
        log = serializer.save()
        if (log.declaration == 0 or 
            (log.defects_en_route and log.defects_en_route.strip()) or 
            (log.incidents and log.incidents.strip())):
            driver_name = get_driver_name(log)
            Notification.objects.create(
                message=f"New defective log #{log.logID} submitted by driver {driver_name}.",
                log_id=log.logID
            )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
@supervisor_required
def deleteLog(request, pk):
    try:
        log = WTT_Log.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'Log not found'}, status=status.HTTP_404_NOT_FOUND)
    
    log.delete()
    return Response({'message': 'Log successfully deleted!'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getItemData(request):
    items = WTT_Log_Inspect_Items.objects.all()
    serializer = LogInspectItemsSerializer(items, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getItem(request, pk):
    try:
        item = WTT_Log_Inspect_Items.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = LogInspectItemsSerializer(item, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@supervisor_required
def addItem(request):
    serializer = LogInspectItemsSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@supervisor_required
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
@permission_classes([IsAuthenticated])
@supervisor_required
def deleteItem(request, pk):
    try:
        item = WTT_Log_Inspect_Items.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
    
    item.delete()
    return Response({'message': 'Item successfully deleted!'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
@supervisor_required
def getNotifications(request):
    if not request.user.is_staff:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
    
    notifications = Notification.objects.filter(read=False).order_by('-created_at')
    serializer = NotificationSerializer(notifications, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def addLogPicture(request):
    serializer = LogPicturesSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def addIncidentPicture(request):
    """
    Endpoint to upload an incident picture.
    Expected payload (multipart/form-data):
      - incidentID: the associated incident's ID.
      - picture: the image file to upload.
    """
    serializer = IncidentPicturesSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getIncidentData(request):
    incidents = WTT_Srs_Incident.objects.all()
    serializer = IncidentSerializer(incidents, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getIncident(request, pk):
    try:
        incident = WTT_Srs_Incident.objects.get(pk=pk)
    except ObjectDoesNotExist:
        return Response({'Incident not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = IncidentSerializer(incident, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addIncident(request):
    serializer = IncidentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Google DocumentAI integration

def get_document_ai_client():
    """Initializes and returns the Document AI client."""
    # Authenticate using the service account key file
    client_options = {"api_endpoint": "us-documentai.googleapis.com"}
    client = documentai.DocumentProcessorServiceClient(client_options=client_options)
    return client

def get_document_ai_processor_name(client):
    """Returns the full resource name of the Document AI processor."""
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    location = "us"
    processor_id = "b8172323254ae090"
    processor_name = client.processor_path(project_id, location, processor_id)
    return processor_name


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def process_document(request):
    """
    API endpoint to process a document using Google Document AI and store the extracted data in the archive.
    """
    if 'document' not in request.FILES:
        return Response(
            {"error": "No document file provided"},
            status=status.HTTP_400_BAD_REQUEST
        )

    document_file = request.FILES['document']
    file_content = document_file.read()
    file_mime_type = document_file.content_type

    try:
        client = get_document_ai_client()
        processor_name = get_document_ai_processor_name(client)

        raw_document = documentai.RawDocument(content=file_content, mime_type=file_mime_type)
        request = documentai.ProcessRequest(
            name=processor_name,
            raw_document=raw_document,
        )
        result = client.process_document(request=request)
        document = result.document

        # Extract all entities from the document
        extracted_data = {}
        if document and document.entities:
            for entity in document.entities:
                entity_type = entity.type_
                entity_value = entity.mention_text
                extracted_data[entity_type] = entity_value

        try:
            # Parse trip value (0=PRE-TRIP, 1=POST-TRIP)
            trip = 0 if extracted_data.get('PRE-TRIP', '').upper() == 'PRE-TRIP' else 1

            # Parse declaration value (0=unchecked, 1=both checked)
            declaration = 1 if (
                extracted_data.get('NO_MAJOR_DEFECTS', '').upper() == 'YES' and 
                extracted_data.get('NO_DEFECTS', '').upper() == 'YES'
            ) else 0
            
            # Create the archive entry
            archive = WTT_Archive.objects.create(
                trip=trip,
                location=extracted_data.get('LOCATION_OF_INSPECTION', ''),
                city=extracted_data.get('CITY', ''),
                date=extracted_data.get('INSPECTION_DATE', ''),
                load=int(extracted_data.get('LOAD_HEIGHT-WIDTH1', 0)) if extracted_data.get('load_height_width1') else None,
                height=int(extracted_data.get('LOAD_HEIGHT-WIDTH1', 0)) if extracted_data.get('load_height_width1') else None,
                defects_en_route=extracted_data.get('DEFECTS_EN_ROUTE', ''),
                remarks=extracted_data.get('REMARKS', ''),
                declaration=declaration,
            )

            # Create inspection details for checked items
            checked_items = []
            for item_id in range(1, 50):  # Check all possible inspection items
                item_key = f"item_{item_id}"
                if extracted_data.get(item_key, '').upper() == 'YES':
                    try:
                        item = WTT_Log_Inspect_Items.objects.get(itemID=item_id)
                        WTT_Archive_Det.objects.create(
                            archiveID=archive,
                            itemID=item
                        )
                        checked_items.append(item_id)
                    except WTT_Log_Inspect_Items.DoesNotExist:
                        continue

            return Response({
                "message": "Document processed and data stored successfully",
                "archive_id": archive.archiveID,
                "checked_items": checked_items,
                "extracted_data": extracted_data
            })

        except Exception as e:
            return Response(
                {"error": f"Error processing document: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    except Exception as e:
        return Response(
            {"error": f"Error processing document: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
                
