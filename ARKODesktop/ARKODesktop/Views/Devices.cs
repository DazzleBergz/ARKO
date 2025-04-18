using System;
using System.Windows.Forms;
using InTheHand.Net.Sockets;
using Newtonsoft.Json;
using System.Collections.Generic;
using ARKODesktop.Views.JsonDataAccess;
using ARKODesktop.Controller.DAO;
using ARKODesktop.Controller;
using ARKODesktop.Models;
using NAudio.Wave;
using ARKODesktop.Properties;


namespace ARKODesktop.Views
{
    public partial class Devices : Form
    {
        private BluetoothComms btComms;
        private VesselDataAccess vesselDAO;
        private List<Vessel> vesselList;
        private List<Label> lblStatus;

        public Devices()
        {
            InitializeComponent();
            btComms = new BluetoothComms();
            vesselDAO = new VesselDataAccess();
            lblStatus = new List<Label>();
            setDevices();
        }

        #region UI Behaviour
        void addCardBluetooth(BluetoothDeviceInfo device)
        {
            Label label = new Label();
            PictureBox pbBluetooth = new PictureBox();
            Label lblMAC = new Label();
            Button button = new Button();
            Panel panel = new Panel();

            pbBluetooth.BackgroundImage = global::ARKODesktop.Properties.Resources.bluetooth;
            pbBluetooth.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            pbBluetooth.Dock = System.Windows.Forms.DockStyle.Left;
            pbBluetooth.Location = new System.Drawing.Point(0, 0);
            pbBluetooth.Size = new System.Drawing.Size(59, 72);
            pbBluetooth.TabIndex = 3;
            pbBluetooth.TabStop = false;

            label.AutoSize = true;
            label.Location = new System.Drawing.Point(65, 7);
            label.Font = new System.Drawing.Font("Cera Pro", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            label.Size = new System.Drawing.Size(51, 20);
            label.TabIndex = 0;
            label.Text = device.DeviceName;

            lblMAC.AutoSize = true;
            lblMAC.ForeColor = System.Drawing.Color.Gray;
            lblMAC.Location = new System.Drawing.Point(66, 36);
            lblMAC.Size = new System.Drawing.Size(35, 13);
            lblMAC.TabIndex = 1;
            lblMAC.Text = "XXXX";

            button.Location = new System.Drawing.Point(187, 46);
            button.Size = new System.Drawing.Size(75, 23);
            button.TabIndex = 1;
            button.Text = "Connect";
            button.Tag = device;
            button.Click += btnConnect_Click;
            button.UseVisualStyleBackColor = true;

            panel.BackColor = System.Drawing.SystemColors.HighlightText;
            panel.Location = new System.Drawing.Point(504, 128);
            panel.Margin = new System.Windows.Forms.Padding(0);
            panel.BorderStyle = BorderStyle.FixedSingle;
            panel.Size = new System.Drawing.Size(266, 72);
            panel.TabIndex = 0;

            panel.Controls.Add(pbBluetooth);
            panel.Controls.Add(button);
            panel.Controls.Add(lblMAC);
            panel.Controls.Add(label);
            fplBluetoothDevices.Controls.Add(panel);
        }

        public void AddCardDevices(Vessel vessel)
        {

            Panel pnlCard = new Panel();
            Label lblVesselName = new Label();
            Label lblNetworkName = new Label();
            Panel pnlPlacer = new Panel();
            Label lblStatus = new Label();
            Button btnControl = new Button();
            Button btnManage = new Button();
            PictureBox pbIcon = new PictureBox();
            ServerComms server = new ServerComms(vessel.Ip_address);

            btnControl.Location = new System.Drawing.Point(273, 64);
            btnControl.Size = new System.Drawing.Size(75, 23);
            btnControl.TabIndex = 4;
            btnControl.Text = "Operate";
            btnControl.Tag = vessel;
            btnControl.UseVisualStyleBackColor = true;
            btnControl.Click += openController;

            btnManage.Location = new System.Drawing.Point(105, 0);
            btnManage.Size = new System.Drawing.Size(25, 23);
            btnManage.TabIndex = 3;
            btnManage.Tag = vessel;
            btnManage.BackgroundImage = Properties.Resources.settings;
            btnManage.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            btnManage.UseVisualStyleBackColor = true;

            pbIcon.BackgroundImage = global::ARKODesktop.Properties.Resources.OutLogo_64_;
            pbIcon.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            pbIcon.Dock = System.Windows.Forms.DockStyle.Left;
            pbIcon.Location = new System.Drawing.Point(0, 0);
            pbIcon.Size = new System.Drawing.Size(112, 30);
            pbIcon.TabIndex = 1;
            pbIcon.TabStop = false;

            lblStatus.Dock = System.Windows.Forms.DockStyle.Fill;
            lblStatus.Font = new System.Drawing.Font("Cera Pro", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            lblStatus.Location = new System.Drawing.Point(0, 0);
            lblStatus.Size = new System.Drawing.Size(130, 29);
            lblStatus.TabIndex = 2;
            lblStatus.Tag = server;
            lblStatus.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;

            pnlPlacer.Location = new System.Drawing.Point(216, 3);
            pnlPlacer.Size = new System.Drawing.Size(130, 29);
            pnlPlacer.TabIndex = 5;

            lblNetworkName.AutoSize = true;
            lblNetworkName.Font = new System.Drawing.Font("Cera Pro", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            lblNetworkName.ForeColor = System.Drawing.Color.Gray;
            lblNetworkName.Location = new System.Drawing.Point(110, 70);
            lblNetworkName.Size = new System.Drawing.Size(97, 16);
            lblNetworkName.TabIndex = 1;
            lblNetworkName.Text = vessel.Network_name;

            lblVesselName.AutoSize = true;
            lblVesselName.Font = new System.Drawing.Font("Cera Pro", 14.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            lblVesselName.Location = new System.Drawing.Point(108, 45);
            lblVesselName.Size = new System.Drawing.Size(123, 24);
            lblVesselName.TabIndex = 0;
            lblVesselName.Text = vessel.Vessel_name;

            pnlCard.BackColor = System.Drawing.SystemColors.ControlLightLight;
            pnlCard.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            pnlCard.Location = new System.Drawing.Point(10, 10);
            pnlCard.Margin = new System.Windows.Forms.Padding(2);
            pnlCard.Size = new System.Drawing.Size(351, 90);
            pnlCard.TabIndex = 0;

            pnlPlacer.Controls.Add(btnManage);
            pnlPlacer.Controls.Add(lblStatus);
            pnlCard.Controls.Add(pbIcon);
            pnlCard.Controls.Add(pnlPlacer);
            pnlCard.Controls.Add(btnControl);
            pnlCard.Controls.Add(lblNetworkName);
            pnlCard.Controls.Add(lblVesselName);

            flpDevices.Controls.Add(pnlCard);
            this.lblStatus.Add(lblStatus);
        }
        
        #endregion
        
        #region Bluetooth
        
        private async void btnScanBT_Click(object sender, EventArgs e)
        {
            BluetoothDeviceInfo[] deviceList = await btComms.DiscoverDevicesAsync();

            foreach (var device in deviceList)
            {
                addCardBluetooth(device);
            }
        }

        private async void btnVerify_Click(object sender, EventArgs e)
        {
            try
            {
                await btComms.SendDataAsync(
                    JsonConvert.SerializeObject(new
                    {
                        command = "Verify",
                        key = txtKey.Text,
                        password = txtKeyPass.Text
                    }));
            }
            catch (Exception ex)
            {
                MessageBox.Show($"{ex}", "Error Sending Data", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

        }

        private async void btnConnect_Click(object sender, EventArgs e)
        {
            var button = sender as Button;
            BluetoothDeviceInfo device = button.Tag as BluetoothDeviceInfo;
            bool result = await btComms.ConnectToDeviceAsync(device.DeviceAddress);

            if (result)
            {
                lblBTConnection.Text = $"Connected to: {device.DeviceName}";
                gbVerify.Enabled = true;
                MessageBox.Show($"Bluetooth successfully connected to: {device.DeviceName}", "Bluetooth Connection", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            else
            {
                lblBTConnection.Text = $"Connected to: ";
                gbVerify.Enabled = false;
                MessageBox.Show($"Cannot connect to : {device.DeviceName}", "Bluetooth Connection", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private async void btnConnectNet_Click(object sender, EventArgs e)
        {
            
        }

        #endregion

        #region DAO
        private void btnAddDevice_Click(object sender, EventArgs e)
        {
            if (vesselDAO.AddVessel(btComms))
            {
                MessageBox.Show($"New Device Successfuly Added", "Insertion Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                setDevices();
            }
            else
            {
                MessageBox.Show($"Failed to Insert Device", "Insertion Unsuccessful", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

        }

        public void setDevices()
        {
            this.vesselList = vesselDAO.SelectAllVessel();
            flpDevices.Controls.Clear();
            foreach (Vessel vessel in vesselList)
            {
                AddCardDevices(vessel);
            }
        }

        public void setVesselInfo()
        {
            gbVesselInfo.Enabled = true;
            gbNetConfigure.Enabled = true;
            lblVesselName.Text = "Vessel Name: " + btComms.DeviceName;
            lblNetwork.Text = "Network: " + btComms.DeviceNetwork;
            lblIP.Text = "IP Address: " + btComms.IpAddress;

        }
        #endregion

        #region Controls
        public void openController(object sender, EventArgs e)
        {
            Button btn = sender as Button;
            Vessel vessel  = btn.Tag as Vessel;
            showControler(vessel.Ip_address, vessel.Token);
        }
        
        public void showControler(String ip, String token)
        {
            Operations controller = new Operations(ip, token);
            controller.Show();
        }
        #endregion

        #region Listener
        private async void readTimerBT_Tick(object sender, EventArgs e)
        {
            String rMessage = await btComms.ReceiveDataAsync();


            if (!string.IsNullOrEmpty(rMessage))
            {
                try
                {
                    BTVerify respond = JsonConvert.DeserializeObject<BTVerify>(rMessage);

                    btComms.Token = respond.token;
                    btComms.DeviceName = respond.vessel_name;
                    btComms.DeviceNetwork = respond.wifi_ssid;
                    btComms.IpAddress = respond.ip_address;
                    MessageBox.Show($"Verified Successfuly", "Verification Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    setVesselInfo();


                }
                catch (Exception ex)
                {

                    MessageBox.Show($"Error: {ex} \nData:{rMessage}", "Verification Failed", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    MessageBox.Show($"Error: {ex} \nData:{rMessage}", "Verification Failed", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }

            }

        }

        private void pingTimer_Tick(object sender, EventArgs e)
        {
            if (lblStatus.Count > 0)
            {
                foreach (Label lbl in lblStatus)
                {
                    ServerComms server = lbl.Tag as ServerComms;

                    // Update label based on server ping status
                    if (server != null && server.PingStatus())
                    {
                        string status = server.GetStatus();
                        if (status == "●   Connected")
                        {
                            lbl.ForeColor = System.Drawing.Color.Gray;
                        }
                        else
                        {
                             lbl.ForeColor = System.Drawing.Color.Green;
                        }
                        lbl.Text = $"{status}";
                        
                    }
                    else
                    {

                        lbl.Text = $"● Offline";
                        lbl.ForeColor = System.Drawing.Color.Red;
                    }
                }
            }
        }
        #endregion

        
    }
}
