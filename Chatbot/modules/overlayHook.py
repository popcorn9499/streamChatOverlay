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
        loop = asyncio.get_event_loop()
        loop.create_task(self.w.websockConnectAdder(self.onConnect))
        loop.create_task(self.w.websockReaderAdder(self.onMessage))

    async def onConnect(self,websocket):
        pass

    async def onMessage(self,message):
        pass
