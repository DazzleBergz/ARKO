import redis
import serial

class Commander:
    def __init__(self):
        self.__DBR = redis.Redis(host='localhost', port=6379, decode_responses=True)
        self.channel = 'commands'
        self.conn = serial.Serial('/dev/ttyACM0', 115200, timeout=1)  # Serial connection
        
    def giveCommand(self, message):
        if self.conn.is_open:
            self.conn.write((message).encode())
            print(f"Sent to Arduino: {message}")
            
    def setDefault(self):
        if self.conn.is_open:
            self.conn.write(("V0;H0;S0;L0;").encode())
            print(f"Sent to Arduino: V0;H0;S0;L0;")

    def observe(self):
        pubsub = self.__DBR.pubsub()
        pubsub.subscribe(self.channel)

        print(f"Listening for messages on Redis channel: {self.channel}")

        for message in pubsub.listen():
            if message['type'] == 'message':
                data = message['data']
                print(f"Received from Redis: {data}")
                if data != "Default":
                    self.giveCommand(data)
                else:
                    self.setDefault()

if __name__ == "__main__":
    commander = Commander()
    commander.observe()
