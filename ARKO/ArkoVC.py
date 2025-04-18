import socket
import pyaudio
import redis
import time
from twisted.internet.protocol import DatagramProtocol
from twisted.internet import reactor
from queue import Queue, Empty

class Client(DatagramProtocol):
    def __init__(self):
        self.__DBR = redis.Redis(host='localhost', port=6379, decode_responses=True)
        self.buffer_size = 2048
        self.sample_rate = 24000
        self.incoming_queue = Queue()
        self.p = pyaudio.PyAudio()
        self.input_stream = None
        self.output_stream = None
        self.local_ip = self.get_local_ip()
        self.another_client = ("192.168.1.154", 8712)  # Default IP (failsafe)

    def listenToUser(self):
        try:
            pubsub = self.__DBR.pubsub()
            pubsub.subscribe("user_channel")

            for message in pubsub.listen():
                if message["type"] == "message":
                    new_ip = message["data"].strip()  # Remove spaces

                    if new_ip:
                        print(f"New user IP received: {new_ip}")
                        self.another_client = (new_ip, 8712)
                    else:
                        print("Received an empty user IP. Ignoring update.")
        except Exception as e:
            print(f"Redis Pub/Sub Error: {e}")

    def get_local_ip(self):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))  
            local_ip = s.getsockname()[0]
            s.close()
            return local_ip
        except Exception as e:
            print(f"Failed to get local IP: {e}")
            return "127.0.0.1"

    def startProtocol(self):
        self.input_stream = self.p.open(format=pyaudio.paInt16,
                                        channels=1,
                                        rate=self.sample_rate,
                                        input=True,
                                        frames_per_buffer=self.buffer_size)

        self.output_stream = self.p.open(format=pyaudio.paInt16,
                                         channels=1,
                                         rate=self.sample_rate,
                                         output=True,
                                         frames_per_buffer=4096)

        reactor.callInThread(self.record)
        reactor.callInThread(self.play)
        reactor.callInThread(self.listenToUser)

    def record(self):
        while True:
            try:
                data = self.input_stream.read(self.buffer_size, exception_on_overflow=False)
                self.transport.write(data, self.another_client)
            except IOError as e:
                print(f"Audio input error: {e}")
            except Exception as e:
                print(f"Unexpected error in record(): {e}")
            time.sleep(0.01)  # Small delay to prevent CPU overload

    def play(self):
        while True:
            try:
                datagram = self.incoming_queue.get(timeout=1)
                if datagram:
                    self.output_stream.write(datagram)
            except Empty:
                pass
            except Exception as e:
                print(f"Error in play(): {e}")

    def datagramReceived(self, datagram, addr):
        sender_ip, sender_port = addr

        if sender_ip == self.local_ip and sender_port == 8712:
            return

        self.incoming_queue.put(datagram)

if __name__ == '__main__':
    port = 8712
    print(f"Working port: {port}")
    reactor.listenUDP(port, Client(), interface='0.0.0.0')
    reactor.run()
