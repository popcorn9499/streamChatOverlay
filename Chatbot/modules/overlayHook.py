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