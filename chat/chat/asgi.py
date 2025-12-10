

import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from . import routing

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chat.settings")
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat.chat.settings')


application=ProtocolTypeRouter({
    "http":get_asgi_application(),
    "websocket":URLRouter(chat.routing.websocket_urlpatterns)
})