package com.example.arkoperator.Adapters;

import android.annotation.SuppressLint;
import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.example.arkoperator.R;

import java.util.List;

public class CustomBluetoothAdapter extends BaseAdapter {

    Context context;
    List<BluetoothDevice>  devices;
    LayoutInflater inflater;

    public CustomBluetoothAdapter(Context context, List<BluetoothDevice> devices) {
        this.context = context;
        this.devices = devices;
        inflater = LayoutInflater.from(context);
    }

    @Override
    public int getCount() {
        return devices.size();
    }

    @Override
    public Object getItem(int i) {
        return null;
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @SuppressLint({"MissingPermission", "ViewHolder"})
    @Override
    public View getView(int index, View view, ViewGroup viewGroup) {
        view = inflater.inflate(R.layout.listview_custom_bluetooth, null);
        TextView txtNameView = (TextView) view.findViewById(R.id.tvDeviceName);
        TextView txtAddressView = (TextView) view.findViewById(R.id.tvDeviceAddress);
        view.setTag(devices.get(index));
        txtNameView.setText(devices.get(index).getName());
        txtAddressView.setText(devices.get(index).getAddress());
        return view;
    }

}
