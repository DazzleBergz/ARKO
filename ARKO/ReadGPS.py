import requests
import serial
import pynmea2
import redis
from time import time

class ReadGPS:
    def __init__(self):
        self.__BAUDRATE = 9600
        self.__HOST_URL = "https://arkovessel.com/api/vessels/location/1"
        self.__DBR = redis.Redis(host='localhost', port=6379, decode_responses=True)

        self.__gps_port = "/dev/ttyUSB1"
        self.__prevTime = time()
        self.__running = True

    def __scanPorts(self):
        for port in ["/dev/ttyUSB1", "/dev/ttyUSB0"]:
            try:
                with serial.Serial(port, self.__BAUDRATE, timeout=1) as gps:
                    for _ in range(10):
                        line = gps.readline().decode('ascii', errors='ignore').strip()
                        print(f"{port} -> {line}")

                        if line.startswith('$GNGGA') or line.startswith('$GNRMC'):
                            self.__gps_port = port
                            return port

            except (serial.SerialException, OSError):
                print(f"❌ Port {port} not available.")

        print("No GPS module detected. Restarting from ttyUSB1.")
        self.__DBR.set("gps_port", "/dev/ttyUSB1")
        return "/dev/ttyUSB1"

    def __parseGPS(self, nmea_sentence):
        try:
            msg = pynmea2.parse(nmea_sentence)
            if isinstance(msg, (pynmea2.types.talker.GGA, pynmea2.types.talker.RMC)):
                lat = msg.latitude
                long = msg.longitude
                print(lat, long)
                self.__saveCoordinates(lat, long)
        except pynmea2.ParseError:
            print("Failed to parse NMEA sentence")

    def __saveCoordinates(self, lat, long):
        if lat != 0.0 and long != 0.0:
            self.__DBR.set("latitude", lat)
            self.__DBR.set("longitude", long)

    def __saveToHost(self, lat, long):
        try:
            if lat != 0.0 and long != 0.0:
                payload = {"latitude": str(lat), "longitude": str(long)}

                response = requests.put(self.__HOST_URL, json=payload)

                if response.status_code == 200:
                    print("✅ Raw response:", response.text)
                else:
                    print(f"❌ Failed to send to host: {response.status_code}")
                    try:
                        message = response.json()
                        print("Response message:", message)
                    except ValueError:
                        print("Raw response:", response.text)
        except Exception as e:
            print(f"❌ Error sending to host: {e}")

    def start(self):
        while self.__running:
            try:
                with serial.Serial(self.__gps_port, self.__BAUDRATE, timeout=1) as gps:

                    while self.__running:
                        line = gps.readline().decode('ascii', errors='ignore').strip()
                        if line.startswith('$GNGGA') or line.startswith('$GNRMC'):
                            self.__parseGPS(line)

                        current_time = time()
                        if current_time - self.__prevTime >= 10:
                            lat = self.__DBR.get("latitude")
                            long = self.__DBR.get("longitude")

                            if lat is not None and long is not None:
                                self.__saveToHost(lat, long)

                            self.__prevTime = current_time

            except (serial.SerialException, OSError):
                print(f"❌ Serial Exception on {self.__gps_port}. Scanning ports...")
                self.__gps_port = self.__scanPorts()

            except KeyboardInterrupt:
                self.__running = False

            except Exception as e:
                print(f"❌ Unexpected Error: {e}")

if __name__ == "__main__":
    rGPS = ReadGPS()
    rGPS.start()
