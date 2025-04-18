package com.example.arkoperator;

import static android.view.View.VISIBLE;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.content.res.AppCompatResources;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.arkoperator.Adapters.CustomBluetoothAdapter;
import com.example.arkoperator.Services.BluetoothService;
import com.example.arkoperator.Network.BluetoothClient;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@SuppressLint({"MissingPermission", "SetTextI18n"})
public class BluetoothActivity extends Activity {

    BluetoothService bluetoothService;
    BluetoothClient client;
    Intent btEnablingIntent;
    ListView lstBondedDeviceView;
    ImageButton btnRefresh;
    Button btnAuthCancel;
    Button btnAuthSend;
    Dialog authDialog;
    Dialog loadingDialog;
    TextView txtLoadingMessage;
    TextView txtAuthError;
    EditText inputKey;
    EditText inputPassword;
    int requestCodeForEnable;
    static final int STATE_LISTENING = 1;
    static final int STATE_CONNECTED = 3;
    static final int STATE_CONNECTION_FAILED = 4;
    static final int STATE_MESSAGE_RECEIVED = 5;
    private static final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bluetooth);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.bluetooth), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        initializeFields();
        initializeComponents();
        initializeEventListeners();
        initializeBluetooth();
    }

    private void initializeFields() {
        bluetoothService = new BluetoothService();
        btEnablingIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
        requestCodeForEnable = 1;
    }

    private void initializeComponents(){
        lstBondedDeviceView = findViewById(R.id.listViewPaired);
        btnRefresh = findViewById(R.id.btnRefresh);
        buildDialogs();
        txtLoadingMessage = loadingDialog.findViewById(R.id.txtLoadingMessage);
        txtAuthError = authDialog.findViewById(R.id.txtAuthError);
        btnAuthCancel = authDialog.findViewById(R.id.btnCancelDialogAuth);
        btnAuthSend = authDialog.findViewById(R.id.btnSendDialogAuth);
        inputKey = authDialog.findViewById(R.id.editTextKey);
        inputPassword = authDialog.findViewById(R.id.editTextPassword);
    }

    private void buildDialogs(){
        authDialog = new Dialog(BluetoothActivity.this);
        authDialog.setContentView(R.layout.dialog_custom_bluetooth_auth);
        Objects.requireNonNull(authDialog.getWindow()).setLayout(ViewGroup.LayoutParams.WRAP_CONTENT,ViewGroup.LayoutParams.WRAP_CONTENT);
        authDialog.getWindow().setBackgroundDrawable(AppCompatResources.getDrawable(getApplicationContext(),R.drawable.custom_dialog_bg));
        authDialog.setCancelable(false);

        loadingDialog = new Dialog(BluetoothActivity.this);
        loadingDialog.setContentView(R.layout.loading_screen);
        Objects.requireNonNull(loadingDialog.getWindow()).setLayout(ViewGroup.LayoutParams.WRAP_CONTENT,ViewGroup.LayoutParams.WRAP_CONTENT);
        loadingDialog.getWindow().setBackgroundDrawable(AppCompatResources.getDrawable(getApplicationContext(),R.drawable.custom_dialog_bg));
        loadingDialog.setCancelable(false);
    }

    private void initializeEventListeners(){

        btnRefresh.setOnClickListener(view ->
                showBondedDevices(bluetoothService.getBondedDevices())
        );

        lstBondedDeviceView.setOnItemClickListener((adapterView, view, i, l) -> {
            txtLoadingMessage.setText(R.string.connecting);
            loadingDialog.show();

            BluetoothDevice device = (BluetoothDevice) view.getTag();

            if (device != null) {
                new Handler().post(() -> client = new BluetoothClient(handler, device, MY_UUID));
            } else {
                loadingDialog.dismiss();
                Toast.makeText(getApplicationContext(), "Error: Device not found!", Toast.LENGTH_LONG).show();
            }
        });


        btnAuthCancel.setOnClickListener(view ->{
            try {
                client.closeConnection();
            } catch (IOException e) {
                Toast.makeText(getApplicationContext(), "Error:Closing connection. " + e, Toast.LENGTH_LONG).show();
            }
            authDialog.dismiss();
        });

        btnAuthSend.setOnClickListener(view ->{
            if (client != null){
                try {

                    client.send("C:" + inputKey.getText() + "," + inputPassword.getText());
                } catch (IOException e) {
                    Toast.makeText(getApplicationContext(), "Error Sending Message!", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    Handler handler = new Handler(Looper.getMainLooper())
    {
        @Override
        public void handleMessage(@NonNull Message msg) {
            super.handleMessage(msg);
            switch (msg.what){
                case STATE_CONNECTED:
                    client.start();
                    loadingDialog.dismiss();
                    authDialog.show();
                    Toast.makeText(getApplicationContext(),"Connected", Toast.LENGTH_LONG).show();
                    break;
                case STATE_CONNECTION_FAILED:
                    loadingDialog.dismiss();
                    Toast.makeText(getApplicationContext(),"Connection Failed", Toast.LENGTH_LONG).show();
                    break;
                case STATE_MESSAGE_RECEIVED:
                    evaluateResponse(msg.obj.toString());
                    break;
            }
        }
    };

    private void initializeBluetooth(){
        if (!bluetoothService.isBluetoothAvailable()){
            Toast.makeText(getApplicationContext(), "Bluetooth does not support on this Device", Toast.LENGTH_LONG).show();
            return;
        }

        if (!bluetoothService.isBluetoothOn()){
            requestBluetoothOn();
        }
        bluetoothService.getBondedDevices();
        showBondedDevices(bluetoothService.getBondedDevices());
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if(requestCode==requestCodeForEnable)
        {
            if(resultCode==RESULT_OK)
            {
                Toast.makeText(getApplicationContext(),"Bluetooth is Enabled", Toast.LENGTH_LONG).show();
            }else if(resultCode==RESULT_CANCELED)
            {
                Toast.makeText(getApplicationContext(),"Bluetooth Enabling Declined", Toast.LENGTH_LONG).show();
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @SuppressLint("MissingPermission")
    private void showBondedDevices(List<BluetoothDevice> devices){

        if (bluetoothService.isBluetoothOn()){
            CustomBluetoothAdapter customBluetoothAdapter = new CustomBluetoothAdapter(getApplicationContext(), devices);
            lstBondedDeviceView.setAdapter(customBluetoothAdapter);
        } else {
            requestBluetoothOn();
        }
    }

    private void requestBluetoothOn() {
        startActivityForResult(btEnablingIntent, requestCodeForEnable);
    }


    private void evaluateResponse(String data) {
        String[] info = data.split("[:,]");
        if (info[0].equals("Auth")){
            txtAuthError.setVisibility(VISIBLE);
            if(info[1].length() > 1){
                txtAuthError.setText("Valid yan pre");
            }else{
                txtAuthError.setText("Invalid Credentials");
            }
        }
        Toast.makeText(getApplicationContext(), "Message Received: " + Arrays.toString(info), Toast.LENGTH_SHORT).show();
    }

}
