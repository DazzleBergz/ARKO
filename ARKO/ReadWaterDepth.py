from pymongo import MongoClient as mg
import serial
import time
import redis

class WaterDepth:
    def __init__(self):
        self.__COM = 0x55
        self.__buffer_RTT = [0] * 4 
        self.__DBR = redis.Redis(host='localhost', port=6379, decode_responses=True)

    def __readPorts(self):
        while True: 
            for count in range(4):
                try:
                    port = f"/dev/ttyACM{count}" 
                    ser = serial.Serial(port, 115200, timeout=1)
                    return ser
                except (serial.SerialException, ValueError):
                    print("No port founds")
            
            time.sleep(2)
            break
            

    def start(self):
        ser = self.__readPorts()

        while True:
            line = ser.readline().decode("utf-8", errors="ignore").strip()
            print(line)
            time.sleep(1)
                
if __name__ == "__main__":
    waterDepth = WaterDepth()
    waterDepth.start()
    