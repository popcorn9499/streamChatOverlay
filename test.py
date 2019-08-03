from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
import json

class SimpleEcho(WebSocket):

    def handleMessage(self):
        # echo message back to client
        print(self.data)
        #self.sendMessage(self.data)

    def handleConnected(self):
        print(self.address, 'connected')
        data = {"Author": "MISTER ME", "Message": "BUT WHY!!"}
        out = json.dumps(data)
        self.sendMessage(out)

    def handleClose(self):
        print(self.address, 'closed')

server = SimpleWebSocketServer('', 8000, SimpleEcho)
server.serveforever()