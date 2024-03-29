import asyncio
import websockets
import json

from utils import config

class server():
    def __init__(self, ip, port):
        self.ip = ip
        self.port = port
        self.websocketList = {}
        self.websocketReadCallback = []
        self.websocketConnectCallback = []
        config.events.onStartup += self.__asyncInit__
    
    
    async def websocketConnectAdder(self,callback):
        self.websocketConnectAdder.append(callback)

    async def websocketReaderAdder(self,callback):          
        self.websocketReadCallback.append(callback)

    async def __asyncInit__(self):
        start_server = websockets.serve(self.connect, self.ip, self.port)
        await start_server

    async def connect(self,websocket, path):
        for callback in self.websocketConnectCallback: #handles creating events for when data comes in to handle the data coming in and out
            asyncio.create_task(callback(websocket))
        await self.read(websocket, path)
        # while True:
        #     data = {"Author": "MISTER ME", "Message": "BUT WHY!!", "ServerIcon": "{d}", "Server": "AHH", "Channel": "WHYYY"}
        #     out = json.dumps(data)
        #     await websocket.send(out)
        #     await asyncio.sleep(0.05)

    async def read(self,websocket, path):
        while True:
            data = await websocket.recv()
            
            try:
                data = json.loads(data)
                for callback in self.websocketReadCallback: #handles creating events for when data comes in to handle the data coming in and out
                    asyncio.create_task(callback(websocket,data))
            except json.decoder.JSONDecodeError:
                print("error")
            except websockets.exceptions.ConnectionClosed:
                #add connection closed prompts

                break

    async def write(self,websocket, data):
        data = json.dumps(data)
        await websocket.send(data)

#w = websocket()