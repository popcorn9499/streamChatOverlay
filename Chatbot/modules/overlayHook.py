from utils import config
from utils import Object
import asyncio
from utils import logger
from utils import fileIO
import os
from utils import websocket


class overlayHook:
    def __init__(self):
        self.w = websocket.server()
        config.events.onMessage += self.onMessage
        self.connectionMessageDetails = []

        loop = asyncio.get_event_loop()
        loop.create_task(self.w.websockReaderAdder(self.connectInitialization))



    async def connectInitialization(self,websocket,data):
        # Websocket connection requirments
        #
        # [Service/Server/Channel in a dictionary]
        # ["ConnectDetails", [{"Service":"SomeService","Server": "SomeServer", "Channel": "SomeChannel"}, ...]]
        # 
        if data[0] == "ConnectDetails":
            messageParameters = {"Websocket": websocket, "messageParameters": data[1]}
            self.connectionMessageDetails.append(messageParameters)

    async def onMessage(self,message):
        pass
