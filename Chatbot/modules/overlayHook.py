from utils import config
from utils import Object
import asyncio
from utils import logger
from utils import fileIO
import os
from utils import websocket


class overlayHook:
    def __init__(self):
        self.w = websocket.server("localhost", 8000)
        self.l = logger.logs("Overlay_Hook")
        config.events.onMessage += self.onMessage
        self.connectionMessageDetails = []

        loop = asyncio.get_event_loop()
        loop.create_task(self.w.websocketReaderAdder(self.connectInitialization))



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
        for data in self.connectionMessageDetails:
            msgParameters = data["messageParameters"]
            ServiceCheck = message.Service == msgParameters["Service"]
            ServerCheck = message.Server == msgParameters["Server"]
            ChannelCheck = message.Channel == msgParameters["Channel"]
            if ServiceCheck & ServerCheck & ChannelCheck:
                data = {"Author": msgParameters.Author, "Message": msgParameters.Contents, "ServerIcon": "", "Server": msgParameters.Server, "Channel": msgParameters.Channel}
                await self.w.write(data["websocket"],data)
