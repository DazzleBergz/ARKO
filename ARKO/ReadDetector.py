from gpiozero import MotionSensor
import redis
from time import sleep
import serial

pir = MotionSensor(17)
dbr = redis.Redis(host='localhost', port=6379, decode_responses=True)
ser = serial.Serial('/dev/ttyUSB0', baudrate=115200, timeout=1)

water_level = 0
angle = 0
motion_direction = "No Motion"

def processData(data):
    global water_level, angle
    datas = data.split(",")
    water_level = int(datas[0]) / 1000
    dbr.set("water_level", water_level)
    angle = int(datas[1])

def updateMotionDirection():
    global motion_direction
    if angle <= 90:
        dbr.set("motion", "right")
    elif 90 < angle < 150:
        dbr.set("motion", "front")
    elif angle >= 150:
        dbr.set("motion", "left")
    else:
        dbr.set("motion", "No Motion Detected")

try:
    while True:
        data = ser.readline()
        if data:
            processData(data.decode('utf-8').strip())
            if pir.motion_detected:
                updateMotionDirection()
            else:
                dbr.set("motion", "No Motion Detected")
            
            # print(f"Water Level: {water_level}, Angle: {angle},Motion Direction: {motion_direction}")

except KeyboardInterrupt:
    print("\nExiting...")
