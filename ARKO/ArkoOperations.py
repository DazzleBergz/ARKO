from pymongo import MongoClient
from time import sleep
import redis

dbm = MongoClient("mongodb://localhost:27017/")
dbr = redis.Redis(host='localhost', port=6379, decode_responses=True)
db = dbm["ArkoDatabase"]

gps = db["Operation"]
gpsRows = []
BATCH_SIZE = 10

while True:
    if dbr.get("operation_id") and dbr.get("operation_id") != "":
        lat = dbr.get("latitude") or "0.0"
        long = dbr.get("longitude") or "0.0"

        gpsRows.append({
            "operation_id": dbr.get("operation_id"),
            "water_level": dbr.get("water_level"),
            "latitude": lat,
            "longitude": long,
        })

        if len(gpsRows) >= BATCH_SIZE:
            gps.insert_many(gpsRows)
            print(f"Inserted {BATCH_SIZE} GPS records into MongoDB.")
            gpsRows.clear()
    sleep(1)
