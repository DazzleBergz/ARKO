import asyncio
from random import randint
import websockets
import redis
from pymongo import MongoClient

class Server:
    def __init__(self):
        self.__DBR = redis.Redis(host='localhost', port=6379, decode_responses=True)
        self.__DBM = MongoClient("mongodb://localhost:27017/")
        self.channel = "commands"
        self.channelVC = "user_channel"
        
    async def __setOperation(self):
        db = self.__DBM["ArkoDatabase"]
        operations = db["Operations"]

        while True:  
            operation_id = "OP" + str(randint(10000, 11111))
            existing_operation = operations.find_one({"operation_id": operation_id})  # 🔹 No `await` needed

            if not existing_operation:
                self.__DBR.set("operation_id", operation_id)
                operations.insert_one({"operation_id": operation_id})
                print(f"Operation ID set: {operation_id}")
                break

    async def __defaultOperation(self):
        self.__DBR.set("operation_id", "")
        self.__DBR.set("user", "")
        self.__DBR.publish(self.channel, "Default")

    async def echo(self, websocket, path):
        print(f"Client Connected: {websocket.remote_address[0]}")
        try:
            async for message in websocket:
                if message == "P":
                    if self.__DBR.get("user") == "":
                        await websocket.send("S:Online")
                    else:
                        await websocket.send("S:Connected")
                elif message == "O":
                    await self.__setOperation()
                    self.__DBR.set("user", str(websocket.remote_address[0]))
                    self.__DBR.publish(self.channelVC, str(websocket.remote_address[0]))
                elif message == "R":
                    lat = self.__DBR.get("latitude") or "0.0"
                    long = self.__DBR.get("longitude") or "0.0"
                    motion = self.__DBR.get("motion") or "No motion deteceted"
                    water_level = self.__DBR.get("water_level") or "0.0"
                    await websocket.send(f"{lat},{long},{motion},{water_level}")
                elif message[0] == "C":
                    datas = message.split(":")
                    if len(datas) > 1 and self.__DBR.get("user") == websocket.remote_address[0]:
                        self.__DBR.publish(self.channel, datas[1])
                elif message == "F":
                    await self.__defaultOperation()
        except websockets.exceptions.ConnectionClosed:
            await self.__defaultOperation() 
            print(f"Client disconnected: {websocket.remote_address[0]}")

    async def start_server(self):
        await self.__defaultOperation()
        server = await websockets.serve(self.echo, "0.0.0.0", 7777)
        print("Server started on ws://0.0.0.0:7777")
        await server.wait_closed()

if __name__ == "__main__":
    servr = Server()
    asyncio.run(servr.start_server())
