package com.example.arkoperator.Network;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.os.Handler;
import android.os.Message;

import com.example.arkoperator.Controllers.BluetoothControllable;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.UUID;

@SuppressLint("MissingPermission")
public class BluetoothClient extends Thread implements BluetoothControllable {
    private BluetoothDevice device;
    private BluetoothSocket socket;
    private InputStream inputStream;
    private OutputStream outputStream;
    private boolean isListening = true;
    Message msg;
    Handler handler;


    public BluetoothClient(Handler handler, BluetoothDevice device, UUID address){
        this.device = device;
        this.handler = handler;
        connect(address);
        try {
            inputStream = socket.getInputStream();
            outputStream = socket.getOutputStream();
        } catch (IOException e) {
            msg = handler.obtainMessage(4, "Error!");
            handler.sendMessage(msg);
        }
    }

    public void run(){
        byte[] buffer = new byte[1024];
        int bytes;

        while (isListening) {
            try {
                bytes = inputStream.read(buffer);
                String receivedMessage = new String(buffer, 0, bytes);

                msg = handler.obtainMessage(5, receivedMessage);
                handler.sendMessage(msg);

            } catch (IOException ignored) {
                break;
            }
        }
    }

    @Override
    public void closeConnection() throws IOException {
        isListening = false;
        socket.close();
    }

    @Override
    public void connect(UUID address) {
        try {
            socket = this.device.createInsecureRfcommSocketToServiceRecord(address);
            socket.connect();
            msg = handler.obtainMessage(3);
            handler.sendMessage(msg);
        } catch (IOException e) {
            msg = handler.obtainMessage(4);
            handler.sendMessage(msg);
        }
    }

    @Override
    public void send(String message) throws IOException{
        outputStream.write(message.getBytes());
        outputStream.flush();
    }
}
