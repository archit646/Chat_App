
from django.urls import path
from app.consumers import TextRoomConsumer
websocket_urlpatterns=[
path('ws/<str:room_name>/',TextRoomConsumer.as_asgi())
]