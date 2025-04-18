using System;
using System.Threading.Tasks;
using InTheHand.Net.Sockets;
using InTheHand.Net.Bluetooth;
using InTheHand.Net;
using System.Linq.Expressions;

namespace ARKODesktop.Controller
{
    public class BluetoothComms
    {
        private BluetoothClient bluetoothClient;
        private BluetoothDeviceInfo[] devices;
        private string token;
        private string deviceName;
        private string deviceNetwork;
        private string ipAddress;


        public string DeviceName { get => deviceName; set => deviceName = value; }
        public string Token { get => token; set => token = value; }
        public string DeviceNetwork { get => deviceNetwork; set => deviceNetwork = value; }
        public string IpAddress { get => ipAddress; set => ipAddress = value; }

        public BluetoothComms()
        {
            //bluetoothClient = new BluetoothClient(); 
        }

        // Discover nearby Bluetooth device 
        public async Task<BluetoothDeviceInfo[]> DiscoverDevicesAsync()
        {
            try
            {
                return await Task.Run(() =>
                {
                    // Discover devices (returns IReadOnlyCollection)
                    var devices = bluetoothClient.DiscoverDevices();
                    return devices;
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during discovery: {ex.Message}");
                throw;
            }
        }


        // Connect to a Bluetooth device
        public async Task<bool> ConnectToDeviceAsync(BluetoothAddress deviceAddress)
        {
            
                await Task.Run(() =>
                {
                    try
                    {
                        var service = BluetoothService.SerialPort;
                        bluetoothClient.Connect(deviceAddress, service);

                        return true;
                    }
                    catch
                    {
                        return false;
                    }
                });

            return true;

        }

        // Send data to the connected device
        public async Task SendDataAsync(string data)
        {
            if (bluetoothClient != null && bluetoothClient.Connected)
            {
                var stream = bluetoothClient.GetStream();
                byte[] buffer = System.Text.Encoding.UTF8.GetBytes(data);

                await stream.WriteAsync(buffer, 0, buffer.Length);
            }
            else
            {
                throw new InvalidOperationException("No active Bluetooth connection.");
            }
        }

        // Receive data from the connected device
        public async Task<string> ReceiveDataAsync()
        {

            if (bluetoothClient != null && bluetoothClient.Connected)
            {
                
                var stream = bluetoothClient.GetStream();
                if (stream.DataAvailable)
                {
                    byte[] buffer = new byte[1024];
                    int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);
                    return System.Text.Encoding.UTF8.GetString(buffer, 0, bytesRead);
                }
            }

            return null;
        }

        public void Disconnect()
        {
            if (bluetoothClient != null && bluetoothClient.Connected)
            {
                bluetoothClient.Close();
            }
        }
    }
}
