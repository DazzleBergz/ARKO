import shutil
from gpiozero import Button
import time
from RPLCD.i2c import CharLCD
from DAO.Network import NetworkManager

class DisplayManager:
    
    def __init__(self):
        self.__lcd = CharLCD(i2c_expander='PCF8574', address=0x27, port=1, cols=16, rows=2, charmap='A00')
        self.__prevButton = Button(24, pull_up=True)  # Using internal pull-up
        self.__nextButton = Button(23, pull_up=True)  # Using internal pull-up
        self.__slide = 1
        self.__networkManager = NetworkManager()
    
    def __display_text(self, header, text, delay=300):
        self.__lcd.clear()
        self.__lcd.cursor_pos = (0, 0)
        self.__lcd.write_string(header)
        self.__lcd.cursor_pos = (1, 0)
        self.__lcd.write_string(text)
            
    
    def __display(self):
        if self.__slide == 1:
            header = "Network:"
            text = self.__networkManager.getWifiSSID() or "Not Connected..."
        elif self.__slide == 2:
            header = "IP Address:"
            text = self.__networkManager.getIPAddress() or "Not Connected..."
        elif self.__slide == 3:
            total, used, free = shutil.disk_usage("/")
            header = f"Storage: {total // 1024**3}GB"
            text = f"Remaining: {free // 1024**3}GB" 
        self.__display_text(header, text, delay=300)
        
    def start(self):
        self.__display()
        while True:
            if self.__prevButton.is_pressed:
                self.__slide -= 1
                if not self.__slide >= 1:
                    self.__slide = 3
                self.__display()
            if self.__nextButton.is_pressed :
                self.__slide += 1
                if not self.__slide <= 3:
                    self.__slide = 1
                self.__display()
            time.sleep(0.25)
            
if __name__ == "__main__":
    time.sleep(10)
    displayManager = DisplayManager()
    displayManager.start()