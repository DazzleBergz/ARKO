from re import split as resplit
import serial
import time
import redis
from DAO.Network import NetworkManager
import shutil

class Bluetooth:
    
    def __init__(self):
        self.__commLine = self.__findPort()
        self.__networkManager = NetworkManager()
        self.__clientDBR = redis.Redis(host='localhost', port=6379, decode_responses=True)

    def __findPort(self):
        return serial.Serial("/dev/ttyAMA0", baudrate=9600, timeout=1)
                
    def start(self):
        while True:
            try:
                if self.__commLine and self.__commLine.is_open:
                    if self.__commLine.in_waiting > 0:
                        data = self.__commLine.readline().decode('utf-8').strip()
                        print(f"Received Data: {data}") 
                        self.__handleData(data)
                else:
                    print("Serial connection is closed!")
            except Exception as e:
                print(f"Error in listener: {e}")
            time.sleep(0.1)

    def __handleData(self, data):
        info = resplit(r'[:,]', data)
        if info[0] == "C":
            status = self.__handleConnection(info[1],info[2])
            if status:
                #auth_token = self.__clientDBR.setex(f"bjwt:{info[-1]}", timedelta(hours=6), jwt.decode()) or "Unknown"
                auth_token = "Sample"
                ip_address = self.__networkManager.getIPAddress() or "Unknown_IP"
                vessel_name = self.__clientDBR.get("vesselName") or "Unknown_Vessel"
                network_name = self.__networkManager.getWifiSSID() or "Unknown_Network"
                                
                self.__send(f"Auth:{auth_token},{ip_address},{vessel_name},{network_name}\n")
            else:
                self.__send(f"Auth:0\n")
        elif info[0] == "N":
            if self.__handleNetwork(info[1],info[2]):
                self.__send(f"Net:{self.__networkManager.getIPAddress()},{self.__networkManager.getWifiSSID()}\n")
            else:
                self.__send("Net:0\n")
            

    def __send(self, info):
        try:
            if self.__commLine and self.__commLine.is_open:
                self.__commLine.write(info.encode('utf-8'))
            else:
                print("Serial connection is not open or available.")
        except Exception as e:
            print(f"Error sending data: {e}. Attempting to reconnect...")
            
    def __handleConnection(self, key: str, password: str) -> bool:
        stored_key = self.__clientDBR.get("key")
        stored_password = self.__clientDBR.get("password")
        
        if stored_key == key and stored_password == password:
            return True
        return False
    
    def __handleNetwork(self, ssid: str, password: str) -> bool:
        if self.__networkManager.connectToWifi(ssid, password):
            return True
        return False
    
if __name__ == "__main__":
    bluetooth = Bluetooth()
    bluetooth.start()
