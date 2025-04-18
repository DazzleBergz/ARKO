package com.example.arkoperator.Services;

import java.io.IOException;
import java.util.UUID;

public interface BluetoothControllable {
    void connect(UUID address);
    void closeConnection() throws IOException;
    void send(String message) throws IOException;
}
