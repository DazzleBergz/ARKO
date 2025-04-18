package com.example.arkoperator.Controllers;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;

import java.util.ArrayList;
import java.util.List;

@SuppressLint("MissingPermission")
public class BluetoothController{

    private final BluetoothAdapter myBluetoothAdapter;
    public BluetoothController() {
        this.myBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        myBluetoothAdapter.cancelDiscovery();
    }
    public List<BluetoothDevice> getBondedDevices(){
        return new ArrayList<>(myBluetoothAdapter.getBondedDevices());
    }
    public boolean isBluetoothAvailable(){
        return myBluetoothAdapter != null;

    }
    public boolean isBluetoothOn() {
        return myBluetoothAdapter.isEnabled();
    }

}
