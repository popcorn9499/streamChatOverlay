# from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
# import json

# class SimpleEcho(WebSocket):

#     def handleMessage(self):
#         # echo message back to client
#         print(self.data)
#         #self.sendMessage(self.data)

#     def handleConnected(self):
#         print(self.address, 'connected')
#         data = {"Author": "MISTER ME", "Message": "BUT WHY!!", "ServerIcon": "{d}", "Server": "AHH", "Channel": "WHYYY"}
#         out = json.dumps(data)
#         self.sendMessage(out)

#     def handleClose(self):
#         print(self.address, 'closed')

# server = SimpleWebSocketServer('', 8000, SimpleEcho)
# server.serveforever()


import asyncio
import websockets
import json
class websocket():
    def __init__(self):
        asyncio.get_event_loop().create_task(self.__asyncInit__())
        self.websocketList = {}
        self.websocketReadCallback = []
        

    async def __asyncInit__(self):
        start_server = websockets.serve(self.connect, "localhost", 8000)
        await start_server

    async def connect(self,websocket, path):
        asyncio.get_event_loop().create_task(self.read(websocket, path))
        while True:
            data = {"Author": "MISTER ME", "Message": "BUT WHY!!", "ServerIcon": "{d}", "Server": "AHH", "Channel": "WHYYY"}
            out = json.dumps(data)
            await websocket.send(out)
            await asyncio.sleep(0.05)

    async def read(self,websocket, path):
        loop = asyncio.get_event_loop()
        while True:
            data = await websocket.recv()
            for callback in self.websocketReadCallback: #handles creating events for when data comes in to handle the data coming in and out
                loop.create_task(callback(data))

    async def write(self,websocket, data):
        data = json.dumps(data)
        await websocket.send(data)

w = websocket()

asyncio.get_event_loop().run_forever()