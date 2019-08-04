import asyncio
import websockets
import json

class server():
    def __init__(self, ip, port):
        self.ip = ip
        self.port = port
        asyncio.get_event_loop().create_task(self.__asyncInit__())
        self.websocketList = {}
        self.websocketReadCallback = []
        self.websocketConnectCallback = []

    
    async def websocketConnectAdder(self,callback):
        self.websocketConnectAdder.append(callback)

    async def websocketReaderAdder(self,callback):          
        self.websocketReadCallback.append(callback)

    async def __asyncInit__(self):
        start_server = websockets.serve(self.connect, self.ip, self.port)
        await start_server

    async def connect(self,websocket, path):
        loop = asyncio.get_event_loop()
        loop.create_task(self.read(websocket, path))
        for callback in self.websocketReadCallback: #handles creating events for when data comes in to handle the data coming in and out
            loop.create_task(callback(websocket))

        # while True:
        #     data = {"Author": "MISTER ME", "Message": "BUT WHY!!", "ServerIcon": "{d}", "Server": "AHH", "Channel": "WHYYY"}
        #     out = json.dumps(data)
        #     await websocket.send(out)
        #     await asyncio.sleep(0.05)

    async def read(self,websocket, path):
        loop = asyncio.get_event_loop()
        while True:
            data = await websocket.recv()
            data = json.load(data)
            for callback in self.websocketReadCallback: #handles creating events for when data comes in to handle the data coming in and out
                loop.create_task(callback(websocket,data))

    async def write(self,websocket, data):
        data = json.dumps(data)
        await websocket.send(data)

#w = websocket()