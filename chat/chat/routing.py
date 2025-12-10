
# from django.urls import path
# from app.consumers import TextRoomConsumer
# websocket_urlpatterns=[
# path('ws/<str:room_name>/',TextRoomConsumer.as_asgi())
# ]

from django.urls import re_path
from app.consumers import TextRoomConsumer

websocket_urlpatterns = [
    re_path(r"ws/(?P<room_name>\w+)/$", TextRoomConsumer.as_asgi()),
]
