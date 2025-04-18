import json
import secrets
import datetime

class SessionManager():
    def __init__(self):
        self.__vesselSessionsBT = self.__selectAllSessions()

    def __selectAllSessions(self):
        try:
            with open('.Models/.Sessions.json', 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            return [], "File Not Found"
        except json.JSONDecodeError:
            return [], "Json Decode Error"
        return [], "Session is empty"

    def __createToken(self):
        used_tokens = {vessel["token"] for vessel in self.__vesselSessionsBT}
        token = secrets.token_hex(32)
        if token not in used_tokens:
            return token
        return None

    def addSession(self):
        token = self.__createToken()
        if token:
            expirationTime = datetime.datetime.now() + datetime.timedelta(hours=6)
            session = {
                "token": token,
                "expiration": expirationTime.strftime("%Y-%m-%d %H:%M:%S")
            }
            self.__vesselSessionsBT.append(session)
            self.__saveSessions()
            return token
        return None

    def updateSession(self, token):
        session = next((session for session in self.__vesselSessionsBT if session["token"] == token), None)
        if session:
            expirationTime = datetime.datetime.now() + datetime.timedelta(hours=6)
            session["expiration"] = expirationTime.strftime("%Y-%m-%d %H:%M:%S")
            self.__saveSessions()
            return True
        return False

    def deleteSession(self, token):
        session = next((session for session in self.__vesselSessionsBT if session["token"] == token), None)
        if session:
            self.__vesselSessionsBT.remove(session)
            self.__saveSessions()
            return True
        return False

    def __saveSessions(self):
        try:
            with open('.Models/.Sessions.json', 'w') as file:
                json.dump(self.__vesselSessionsBT, file, indent=4)
        except IOError:
            print("Error saving the session data to the file.")

    def isExpired(self, token):
        session = self.getSession(token)
        if session:
            expirationTime = datetime.datetime.strptime(session["expiration"], "%Y-%m-%d %H:%M:%S")
            if expirationTime < datetime.datetime.now():
                return True
        return False

    def getSession(self, token):
        return next((session for session in self.__vesselSessionsBT if session["token"] == token), None)

    def printSessions(self):
        print(self.__vesselSessionsBT)