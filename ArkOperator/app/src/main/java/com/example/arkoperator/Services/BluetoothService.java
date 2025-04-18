package com.example.arkoperator.Services;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;

import java.util.ArrayList;
import java.util.List;

@SuppressLint("MissingPermission")
public class BluetoothService {

    private final BluetoothAdapter myBluetoothAdapter;
    public BluetoothService() {
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
