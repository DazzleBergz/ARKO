using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using System.IO;
using ARKODesktop.Views.Components;
using ARKODesktop.Controller;
using WebSocketSharp;

namespace ARKODesktop
{

    public partial class Operations : Form
    {
        

        private Dictionary<string, Button> btnControls;
        private Dictionary<string, bool> btnToggleState;
        private ThrottleControl customThrottleControl;
        
        private String IpAdress;
        private String token;
        private VideoFeed videoFeed;
        private VOIP voip;
        private Commands command;
        private ServerReadings serverReadings;

        private bool lights;
        private bool engine = true;
        private string movement = "ahead";
        private string direction = "starboard";


        static Timer timer;
        static bool messageReceived = false;

        public Operations(string IpAdress, string token)
        {
            InitializeComponent();
            KeyPreview = true;
            this.KeyUp += Operations_KeyUp;
            this.KeyDown += Operations_KeyDown;
            btnControls = new Dictionary<string, Button>();
            btnToggleState = new Dictionary<string, bool>();

            string rootPath = GetProjectRootPath();
            this.IpAdress = IpAdress;
            videoFeed = new VideoFeed();
            voip = new VOIP(IpAdress);
            command = new Commands(IpAdress, token);
            serverReadings = new ServerReadings(IpAdress, token);

            // Control Rudder and Throttle
            createBtnControls("A", 60, 720, "btnLeftRudder");
            createBtnControls("D", 280, 720, "btnRightRudder");
            createBtnControls("W", 170, 610, "btnThrottleUp");
            createBtnControls("S", 170, 720, "btnThrottleDown");

            // Toggle Controls
            createToggleControls(rootPath + @"Resources\control_icons\mic_off_white.png", 1525, 100, "btnMic");
            createToggleControls(rootPath + @"Resources\control_icons\audio_off.png", 1525, 160, "btnAudio");
            createToggleControls(rootPath + @"Resources\control_icons\light_off.png", 1525, 220, "btnLight");
            createButtonAction(rootPath + @"Resources\control_icons\pin.png", 1525, 280, "btnPin", Keys.P);
            createToggleGear(1325, 720, "btnGear");

            //Time Panel
            createPanelTime("pnlTime", 1375, 12);
            lblIRSensor.ForeColor = Color.FromArgb(225, HexToColor("#113547"));
            lblLatitude.ForeColor = Color.FromArgb(225, HexToColor("#113547"));
            lblLongitude.ForeColor = Color.FromArgb(225, HexToColor("#113547"));
            lblWaterLvl.ForeColor = Color.FromArgb(225, HexToColor("#113547"));

            //Throttle
            CreateThrottleControl();
            pcbCam.SendToBack();

            
            videoFeed.StartCamera(this.IpAdress, pcbCam);
            voip.StartRecording();
            voip.StartReceiving();
        }
        #region Operations

        private void Operations_KeyDown(object sender, KeyEventArgs e)
        {

            if (e.KeyCode == Keys.A)
            {
                direction = "starboard";
                HighlightButton("A");
            }
            else if (e.KeyCode == Keys.D)
            {
                direction = "port";
                HighlightButton("D");
            }
            else if (e.KeyCode == Keys.W)
            {
                HighlightButton("W");
                IncreaseThrottle();
            }
            else if (e.KeyCode == Keys.S)
            {
                HighlightButton("S");
                DecreaseThrottle();
            }
            else if (e.KeyCode == Keys.M)
            {
                ToggleButtonState("btnMic");  // Toggle microphone button
            }
            else if (e.KeyCode == Keys.L)
            {
                ToggleButtonState("btnLight");  // Toggle light button
            }
            else if (e.KeyCode == Keys.P)  // Triggering highlight for Pin via key
            {
                HighlightButton("btnPin");
            }
            else if (e.KeyCode == Keys.N)
            {
                ToggleButtonState("btnAudio");
            }
            else if (e.KeyCode == Keys.B)
            {
                ToggleButtonState("btnGear");
            }
            command.SendControlCommand((byte)customThrottleControl.ThrottleValue, lights, engine, movement, direction);
            direction = "";
        }

        private void Operations_KeyUp(object sender, KeyEventArgs e)
        {
            // Reset the button style when the key is released
            if (e.KeyCode == Keys.A || e.KeyCode == Keys.D || e.KeyCode == Keys.W || e.KeyCode == Keys.S || e.KeyCode == Keys.P)
            {
                ResetButtonStyles();
            }
        }
        
        private void btnStopOperation_Click(object sender, EventArgs e)
        {
            CloseAllListeners();
            this.Close();
        }

        private void Operations_FormClosing(object sender, FormClosingEventArgs e)
        {
            CloseAllListeners();
        }

        // Assuming serverReadings is an instance of ServerReadings
        private void tmReadings_Tick(object sender, EventArgs e)
        {
            try
            {

                lblIRSensor.Text = $"IR Sensor: {serverReadings.Detected}";
                lblLatitude.Text = $"Latitude: {serverReadings.GPS.Latitude:F6}";
                lblLongitude.Text = $"Longitude: {serverReadings.GPS.Longitude:F6}";
                lblWaterLvl.Text = $"Water Level: {serverReadings.WaterLevel:F2} meters";
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error updating readings: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }


        private void CloseAllListeners()
        {
            try
            {
                if (videoFeed != null)
                {
                    videoFeed.StopCamera();
                    videoFeed = null;
                }

                if (voip != null)
                {
                    voip.closeVOIP();
                    voip = null;
                }

                if (command != null)
                {
                    command.CloseConnection();
                    command = null;
                }

                if (customThrottleControl != null)
                {
                    customThrottleControl.Dispose();
                    customThrottleControl = null;
                }

                foreach (var btn in btnControls.Values)
                {
                    btn.Dispose();
                }

                btnControls.Clear();
                btnToggleState.Clear();

                GC.Collect(); 
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error while closing resources: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
        
        #endregion End Operations
        
        #region UI Behaviours

        #region Create Components
        private void createBtnControls(string btnTextName, int x, int y, string btnName)
        {
            Button btnControl = new Button
            {
                Name = btnName,
                Size = new Size(100, 100),
                Location = new Point(x, y),
                BackColor = Color.FromArgb(150, HexToColor("#277CA5")),
                Anchor = AnchorStyles.Bottom | AnchorStyles.Left,
                TabStop = true,
                Text = btnTextName,
                Font = new Font("Microsoft Sans Serif", 16, FontStyle.Bold),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,

            };
            btnControl.FlatAppearance.BorderSize = 0;
            btnControls[btnTextName] = btnControl;
            Controls.Add(btnControl);
        }

        private void createToggleControls(string imagePath, int x, int y, string btnName)
        {
            Button btnToggle = new Button
            {
                Name = btnName,
                Size = new Size(50, 50),
                Location = new Point(x, y),
                BackColor = Color.FromArgb(150, HexToColor("#277CA5")),
                Anchor = AnchorStyles.Top | AnchorStyles.Right,
                TabStop = true,
                FlatStyle = FlatStyle.Flat,
            };

            if (System.IO.File.Exists(imagePath))
            {
                btnToggle.Image = Image.FromFile(imagePath);
                btnToggle.ImageAlign = ContentAlignment.MiddleCenter;
            }
            else
            {
                MessageBox.Show($"Image not found at path: {imagePath}", "Error");
            }

            // Add to the dictionary of controls
            btnControls[btnName] = btnToggle;
            btnToggleState[btnName] = false; // Initially off

            // Click event to toggle state
            btnToggle.Click += (sender, e) => ToggleButtonState(btnName);

            Controls.Add(btnToggle);
        }

        private void createToggleGear(int x, int y, string btnName)
        {
            Button btnToggle = new Button
            {
                Name = btnName,
                Size = new Size(250, 100),
                Location = new Point(x, y),
                BackColor = Color.FromArgb(150, HexToColor("#277CA5")),
                Anchor = AnchorStyles.Bottom | AnchorStyles.Right,
                TabStop = true,
                FlatStyle = FlatStyle.Flat,
                Text = "FORWARD",
                ForeColor = Color.White,
                Font = new Font("Microsoft Sans Serif", 16, FontStyle.Bold),

            };

            // Add to the dictionary of controls
            btnControls[btnName] = btnToggle;
            btnToggleState[btnName] = false; // Initially off

            // Click event to toggle state
            btnToggle.Click += (sender, e) => ToggleButtonState(btnName);

            Controls.Add(btnToggle);
        }

        private void createButtonAction(string imagePath, int x, int y, string btnName, Keys pressKey)
        {
            Button btn = new Button
            {
                Name = btnName,
                Size = new Size(50, 50),
                Location = new Point(x, y),
                BackColor = Color.FromArgb(150, HexToColor("#277CA5")),
                Anchor = AnchorStyles.Top | AnchorStyles.Right,
                TabStop = true,
                FlatStyle = FlatStyle.Flat,
            };

            if (System.IO.File.Exists(imagePath))
            {
                btn.Image = Image.FromFile(imagePath);
                btn.ImageAlign = ContentAlignment.MiddleCenter;
            }
            else
            {
                MessageBox.Show($"Image not found at path: {imagePath}", "Error");
            }


            btnControls[btnName] = btn;  // Add to the dictionary

            if (pressKey != Keys.None)
            {
                btn.KeyDown += (sender, e) =>
                {
                    if (e.KeyCode == pressKey)
                    {
                        HighlightButton(btnName);
                    }
                };
            }
            Controls.Add(btn);

        }

        private void createPanelTime(string pnlName, int x, int y)
        {
            Panel panel = new Panel
            {
                Name = pnlName,
                Size = new Size(200, 50),
                Location = new Point(x, y),
                BackColor = Color.FromArgb(150, HexToColor("#113547")),
                Anchor = AnchorStyles.Top | AnchorStyles.Right,
                TabStop = true,
            };

            Label timeLabel = new Label
            {
                Name = pnlName + "_TimeLabel",
                AutoSize = false,
                Size = new Size(panel.Width, panel.Height),
                ForeColor = Color.White,
                TextAlign = ContentAlignment.MiddleCenter,
                Font = new Font("Microsoft Sans Serif", 16, FontStyle.Bold),

            };

            timeLabel.Location = new Point(
                (panel.Width - timeLabel.Width) / 2, // Center horizontally
                (panel.Height - timeLabel.Height) / 2 // Center vertically
            );



            Timer timer = new Timer
            {
                Interval = 1000
            };

            // Update the Label text every tick
            timer.Tick += (sender, args) =>
            {
                timeLabel.Text = DateTime.Now.ToString("hh:mm tt");
            };

            // Start the Timer
            timer.Start();
            panel.Controls.Add(timeLabel);
            this.Controls.Add(panel);

        }

        #endregion

        #region Behaviors
        private void HighlightButton(string btnTextName)
        {
            if (btnControls.ContainsKey(btnTextName))
            {
                Button btn = btnControls[btnTextName];
                btn.BackColor = Color.FromArgb(255, HexToColor("#113547"));  // Fully opaque background when button is pressed
            }
        }

        private void ResetButtonStyles()
        {
            foreach (var btn in btnControls.Values)
            {
                // Only reset the background of non-toggled buttons
                if (btn.Name != "btnMic" && btn.Name != "btnLight" && btn.Name != "btnAudio")
                {
                    btn.BackColor = Color.FromArgb(100, HexToColor("#277CA5"));  // Reset to semi-transparent background color
                }
            }
        }

        private void ToggleButtonState(string btnName)
        {
            string rootPath = GetProjectRootPath();
            if (btnToggleState.ContainsKey(btnName))
            {
                bool currentState = btnToggleState[btnName];
                btnToggleState[btnName] = !currentState;  // Toggle the state

                Button btn = btnControls[btnName];

                // Toggle the image and background color based on the button state
                if (btnToggleState[btnName])
                {
                    if (btnName == "btnMic")
                    {
                        btn.Image = Image.FromFile(rootPath + @"Resources\control_icons\mic_on_white.png");
                        voip.ToggleMic(true);

                    }
                    else if (btnName == "btnLight")
                    {
                        btn.Image = Image.FromFile(rootPath + @"Resources\control_icons\light_on.png");
                        lights = true;

                    }
                    else if (btnName == "btnAudio")
                    {
                        
                        btn.Image = Image.FromFile(rootPath + @"Resources\control_icons\audio_on.png");
                        voip.ToggleSpeaker(true);
                    }
                    else if (btnName == "btnGear")
                    {
                        command.SendControlCommand((byte)customThrottleControl.ThrottleValue, lights, engine, movement, direction);
                        btn.Text = "REVERSE";
                        
                    }

                    btn.BackColor = Color.FromArgb(255, HexToColor("#113547"));  // On state (active)
                }
                else
                {
                    if (btnName == "btnMic")
                    {
                        btn.Image = Image.FromFile(rootPath + @"Resources\control_icons\mic_off_white.png");
                        voip.ToggleMic(false);
                    }
                    else if (btnName == "btnLight")
                    {
                        btn.Image = Image.FromFile(rootPath + @"Resources\control_icons\light_off.png");
                        lights = false;
                    }
                    else if (btnName == "btnAudio")
                    {
                        btn.Image = Image.FromFile(rootPath + @"Resources\control_icons\audio_off.png");
                        voip.ToggleSpeaker(false);
                    }
                    else if (btnName == "btnGear")
                    {

                        btn.Text = "FORWARD";

                    }

                    btn.BackColor = Color.FromArgb(150, HexToColor("#277CA5"));  // Off state (inactive)
                }
            }
        }

        private void CreateThrottleControl()
        {
            customThrottleControl = new ThrottleControl
            {
                Location = new Point(50, 300),
                Size = new Size(50, 300),
                Dock = DockStyle.Left,
                Anchor = AnchorStyles.Left,
            };
            Controls.Add(customThrottleControl);
        }

        private void IncreaseThrottle()
        {
            if (customThrottleControl.ThrottleValue < 100)
            {
                customThrottleControl.ThrottleValue += 10;

            }
        }

        private void DecreaseThrottle()
        {
            if (customThrottleControl.ThrottleValue > 0)
            {
                customThrottleControl.ThrottleValue -= 10;
            }
        }

        #endregion

        #region Styles
        private Color HexToColor(string hex)
        {
            return ColorTranslator.FromHtml(hex);
        }

        private string GetProjectRootPath()
        {
            return Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\..\"));

        }


        #endregion

        #endregion

       

    }
}


