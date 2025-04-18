import json
import subprocess
import time

class SettingManager(SessionManager):
    def __init__(self):
        super().__init__()
        self.__vesselCreds = None
        self.__loadSettings()

    def readSettings(self):
        if self.__vesselCreds:
            return self.__vesselCreds
        else:
            print("No settings found.")
            return None

    def updateSetting(self, key, value):
        if key in self.__vesselCreds:
            self.__vesselCreds[key] = value
            self.__saveSettings()
            return True
        else:
            return False

    def __verifyKey(self, key):
        if self.__vesselCreds.get("key") == key:
            return True
        else:
            return False

    def __verifyPassword(self, password):
        if self.__vesselCreds.get("password") == password:
            print("Password verification successful.")
            return True
        else:
            print("Password verification failed.")
            return False

    def verifyKeyAndPassword(self, key, password):
        key_verified = self.__verifyKey(key)
        password_verified = self.__verifyPassword(password)

        if key_verified and password_verified:
            print("Both key and password verification successfull.")
            info = self.readSettings()
            info.update({"token": super().addSession(), "ip_address": self._getIPAddress()})
            print(info)
            return True, info
        else:
            return False, "Key and password verification failed."
    
    # Netork Settings
    def __saveSettings(self):
        try:
            with open(self.__settingsFilePath, 'w') as file:
                json.dump(self.__vesselCreds, file, indent=4)
            print("Settings saved successfully.")
        except IOError:
            print("Error saving settings.")

    def _getIPAddress(self):
        try:
            result = subprocess.run('nmcli -t -f ip4.address dev show', shell=True, 
                                    capture_output=True, text=True, check=True)
            ipAddresses = result.stdout.splitlines()
            for ip in ipAddresses:
                if ip:
                    return ip.split(':')[1].split("/")[0]
        except subprocess.CalledProcessError:
            return "Error retrieving IP address"

    def _getWifiStatus(self):
        try:
            result = subprocess.run(['nmcli', '-t', '-f', 'ACTIVE,SSID', 'dev', 'wifi'], 
                                    stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

            for line in result.stdout.splitlines():
                active, ssid = line.split(":")
                if active == "yes":
                    return True, ssid

            return False, None
        except subprocess.CalledProcessError:
            return False, None
        
    def __connectToWifi(self, ssid, password):
        """Connect to a Wi-Fi network, whether SSID is hidden or visible."""
        try:
            subprocess.run(['nmcli', 'connection', 'delete', ssid], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            result = subprocess.run([
                'nmcli', 'device', 'wifi', 'connect', ssid, 'password', password, 'hidden', 'yes'
            ], capture_output=True, text=True)

            if "successfully activated" in result.stdout.lower():
                print(f"Connected to {ssid} successfully.")
                return self._getIPAddress()
            else:
                print(f"Failed to connect to {ssid}: {result.stderr}")
                return None

        except Exception as e:
            print(f"Error connecting to Wi-Fi: {e}")
            return None

    def _setWifi(self, token, ssid, password):
        try:
            status, response = self._verifyToken(int(token))
            if status:
                ipAddress = self.__connectToWifi(ssid, password)
                if ipAddress:
                    self.__updateWifiCredential(ssid)
                    return True, ipAddress
            return False, response
        except:
            return False, "Invalid Data"

    # getters and setters
    def getOnUse(self):
        return self.__vesselCreds["on_use"]