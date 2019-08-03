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
        

    async def __asyncInit__(self):
        start_server = websockets.serve(self.hello, "localhost", 8000)
        await start_server

    async def hello(self,websocket, path):
        name = await websocket.recv()
        print(type(name))
        print(f"< {name}")
        print("    " + str(websocket.remote_address))
        print("    " + str(websocket.local_address))
        greeting = f"Hello {name}!"




        data = {"Author": "MISTER ME", "Message": "BUT WHY!!", "ServerIcon": "{d}", "Server": "AHH", "Channel": "WHYYY"}
        out = json.dumps(data)
        await websocket.send(out)
        print(f"> {greeting}")


w = websocket()

asyncio.get_event_loop().run_forever()