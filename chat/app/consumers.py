
from channels.generic.websocket import AsyncWebsocketConsumer
import json
class TextRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name=self.scope['url_route']['kwargs']['room_name']
        await self.channel_layer.group_add(self.room_name,self.channel_name)
        await self.accept()

    async def receive(self,text_data):
        data=json.loads(text_data)
        # message=data['message']
        # sender=data['sender']
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type":"chat",
                "message":data['message'],
                "sender":data['sender']
            }
        )    

    async def chat(self,event):
            await self.send(json.dumps({
                "sender":event['sender'],
                "message":event['message'],   
            }))   

        
        
    
        
    