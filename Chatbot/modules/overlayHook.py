from utils import config
from utils import Object
import asyncio
from utils import logger
from utils import fileIO
import os
from utils import websocket


class overlayHook:
    def __init__(self):
        self.w = websocket.server("0.0.0.0", 8000)
        self.l = logger.logs("Overlay_Hook")
        config.events.onMessage += self.onMessage
        self.connectionMessageDetails = []

        config.events.onStartup += self.startup


    async def startup(self):
        asyncio.create_task(self.w.websocketReaderAdder(self.connectInitialization))

    async def connectInitialization(self,websocket,data):
        # Websocket connection requirments
        #
        # [Service/Server/Channel in a dictionary]
        # ["ConnectDetails", [{"Service":"SomeService","Server": "SomeServer", "Channel": "SomeChannel"}, ...]]
        # 
        if data[0] == "ConnectDetails":
            messageParameters = {"websocket": websocket, "messageParameters": data[1]}
            self.l.logger.info(data[1])
            self.connectionMessageDetails.append(messageParameters)

    async def onMessage(self,message):
        self.l.logger.info("Recieved Message")
        for data in self.connectionMessageDetails:
            websocket = data["websocket"]
            msgParametersList = data["messageParameters"]
            for msgParameters in msgParametersList:
                Message = message.Message
                ServiceCheck = Message.Service == msgParameters["Service"]
                ServerCheck = Message.Server == msgParameters["Server"]
                ChannelCheck = Message.Channel == msgParameters["Channel"]
                if ServiceCheck & ServerCheck & ChannelCheck:
                    serviceIcon = ""
                    try:
                        serviceIcon = msgParameters["ServiceIcon"]
                    except:
                        pass
                    data = {"Author": Message.Author, "Message": Message.Contents, "ServiceIcon": serviceIcon, "Server": Message.Server, "Channel": Message.Channel,"Emojis": Message.Emojis, "Badges": Message.Badges}
                    try:
                        await self.w.write(websocket,data)
                    except:
                        pass
o = overlayHook()