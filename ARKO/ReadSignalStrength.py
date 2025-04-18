import subprocess
import time

def get_wifi_strength():
    try:
        result = subprocess.check_output(["iw", "dev", "wlan0", "link"]).decode("utf-8").splitlines()

        for line in result:
            if "signal" in line:
                signal_level = int(line.split()[1])
                return signal_level
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def dbm_to_percentage(dbm):
    if dbm is None:
        return 0 

    dbm = max(-100, min(dbm, -30))
    
    percentage = round(2 * (dbm + 100))

    return min(percentage, 100)


try:
    while True:
        dbm = get_wifi_strength()
        
        if dbm is not None:
            print(f"WiFi Signal: {dbm} dBm ({dbm_to_percentage(dbm)}%)")
        else:
            print("No WiFi signal detected.")
        
        time.sleep(1)
except KeyboardInterrupt:
    print("\nExiting...")
