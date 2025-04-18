import subprocess
import redis

class NetworkManager:
    
    def __init__(self):
        self.__clientDBR = redis.Redis(host='localhost', port=6379, decode_responses=True)
    
    def getIPAddress(self):
            try:
                result = subprocess.run('nmcli -t -f ip4.address dev show', shell=True, 
                                        capture_output=True, text=True, check=True)
                ipAddresses = result.stdout.splitlines()
                for ip in ipAddresses:
                    if ip:
                        ipAdd = ip.split(':')[1].split("/")[0]
                        self.__clientDBR.set("network", ip)
                        return ipAdd
            except subprocess.CalledProcessError:
                return "Error retrieving IP address"
        
    def connectToWifi(self, ssid, password):
        try:
            ssid = ssid.strip()
            password = password.strip()
            result = subprocess.run(
                ['nmcli', 'dev', 'wifi', 'connect', ssid, 'password', password, 'hidden', 'yes'],
                capture_output=True, text=True, check=True
            )

            if result.returncode == 0:
                ip = self.getIPAddress()
                self.__clientDBR.set("network", ip)
                return ip
            return None
        except subprocess.CalledProcessError as e:
            print(f"WiFi connection failed: {e.stderr}")
            return None

        
    def getWifiSSID(self):
        try:
            result = subprocess.check_output(["iwgetid", "-r"], text=True).strip()
            self.__clientDBR.set("network", result if result else "Not connected")
            return result if result else "Not connected"
        except subprocess.CalledProcessError:
            return "Error retrieving SSID"