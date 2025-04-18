
namespace ARKODesktop
{
    partial class Operations
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Operations));
            this.lblIRSensor = new System.Windows.Forms.Label();
            this.lblWaterLvl = new System.Windows.Forms.Label();
            this.lblLongitude = new System.Windows.Forms.Label();
            this.lblLatitude = new System.Windows.Forms.Label();
            this.btnStopOperation = new System.Windows.Forms.Button();
            this.flowLayoutPanel1 = new System.Windows.Forms.FlowLayoutPanel();
            this.pcbCam = new System.Windows.Forms.PictureBox();
            this.tmReadings = new System.Windows.Forms.Timer(this.components);
            this.flowLayoutPanel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pcbCam)).BeginInit();
            this.SuspendLayout();
            // 
            // lblIRSensor
            // 
            this.lblIRSensor.AutoSize = true;
            this.lblIRSensor.BackColor = System.Drawing.Color.Transparent;
            this.lblIRSensor.Font = new System.Drawing.Font("Cera Pro", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblIRSensor.Location = new System.Drawing.Point(439, 10);
            this.lblIRSensor.Margin = new System.Windows.Forms.Padding(10, 10, 20, 5);
            this.lblIRSensor.Name = "lblIRSensor";
            this.lblIRSensor.Size = new System.Drawing.Size(162, 26);
            this.lblIRSensor.TabIndex = 4;
            this.lblIRSensor.Text = "Heat Detected:";
            // 
            // lblWaterLvl
            // 
            this.lblWaterLvl.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.lblWaterLvl.AutoSize = true;
            this.lblWaterLvl.BackColor = System.Drawing.Color.Transparent;
            this.lblWaterLvl.Font = new System.Drawing.Font("Cera Pro", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblWaterLvl.Location = new System.Drawing.Point(631, 10);
            this.lblWaterLvl.Margin = new System.Windows.Forms.Padding(10, 10, 20, 5);
            this.lblWaterLvl.Name = "lblWaterLvl";
            this.lblWaterLvl.Size = new System.Drawing.Size(135, 26);
            this.lblWaterLvl.TabIndex = 3;
            this.lblWaterLvl.Text = "Water Level:";
            // 
            // lblLongitude
            // 
            this.lblLongitude.AutoSize = true;
            this.lblLongitude.BackColor = System.Drawing.Color.Transparent;
            this.lblLongitude.Font = new System.Drawing.Font("Cera Pro", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblLongitude.Location = new System.Drawing.Point(292, 10);
            this.lblLongitude.Margin = new System.Windows.Forms.Padding(10, 10, 20, 5);
            this.lblLongitude.Name = "lblLongitude";
            this.lblLongitude.Size = new System.Drawing.Size(117, 26);
            this.lblLongitude.TabIndex = 2;
            this.lblLongitude.Text = "Longitude:";
            // 
            // lblLatitude
            // 
            this.lblLatitude.AutoSize = true;
            this.lblLatitude.BackColor = System.Drawing.Color.Transparent;
            this.lblLatitude.Font = new System.Drawing.Font("Cera Pro", 15.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblLatitude.Location = new System.Drawing.Point(164, 10);
            this.lblLatitude.Margin = new System.Windows.Forms.Padding(10, 10, 20, 5);
            this.lblLatitude.Name = "lblLatitude";
            this.lblLatitude.Size = new System.Drawing.Size(98, 26);
            this.lblLatitude.TabIndex = 1;
            this.lblLatitude.Text = "Latitude:";
            // 
            // btnStopOperation
            // 
            this.btnStopOperation.Font = new System.Drawing.Font("Cera Pro", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnStopOperation.Location = new System.Drawing.Point(3, 3);
            this.btnStopOperation.Name = "btnStopOperation";
            this.btnStopOperation.Size = new System.Drawing.Size(148, 38);
            this.btnStopOperation.TabIndex = 2;
            this.btnStopOperation.Text = "Stop Operation";
            this.btnStopOperation.UseVisualStyleBackColor = true;
            this.btnStopOperation.Click += new System.EventHandler(this.btnStopOperation_Click);
            // 
            // flowLayoutPanel1
            // 
            this.flowLayoutPanel1.BackColor = System.Drawing.SystemColors.HighlightText;
            this.flowLayoutPanel1.Controls.Add(this.btnStopOperation);
            this.flowLayoutPanel1.Controls.Add(this.lblLatitude);
            this.flowLayoutPanel1.Controls.Add(this.lblLongitude);
            this.flowLayoutPanel1.Controls.Add(this.lblIRSensor);
            this.flowLayoutPanel1.Controls.Add(this.lblWaterLvl);
            this.flowLayoutPanel1.Dock = System.Windows.Forms.DockStyle.Top;
            this.flowLayoutPanel1.Location = new System.Drawing.Point(0, 0);
            this.flowLayoutPanel1.Name = "flowLayoutPanel1";
            this.flowLayoutPanel1.Size = new System.Drawing.Size(1600, 45);
            this.flowLayoutPanel1.TabIndex = 5;
            // 
            // pcbCam
            // 
            this.pcbCam.Dock = System.Windows.Forms.DockStyle.Fill;
            this.pcbCam.Location = new System.Drawing.Point(0, 0);
            this.pcbCam.Name = "pcbCam";
            this.pcbCam.Size = new System.Drawing.Size(1600, 900);
            this.pcbCam.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.pcbCam.TabIndex = 6;
            this.pcbCam.TabStop = false;
            // 
            // tmReadings
            // 
            this.tmReadings.Enabled = true;
            this.tmReadings.Interval = 1000;
            this.tmReadings.Tick += new System.EventHandler(this.tmReadings_Tick);
            // 
            // Operations
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.ClientSize = new System.Drawing.Size(1600, 900);
            this.Controls.Add(this.flowLayoutPanel1);
            this.Controls.Add(this.pcbCam);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.None;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "Operations";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Controller";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Operations_FormClosing);
            this.flowLayoutPanel1.ResumeLayout(false);
            this.flowLayoutPanel1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.pcbCam)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.Label lblIRSensor;
        private System.Windows.Forms.Label lblWaterLvl;
        private System.Windows.Forms.Label lblLongitude;
        private System.Windows.Forms.Label lblLatitude;
        private System.Windows.Forms.Button btnStopOperation;
        private System.Windows.Forms.FlowLayoutPanel flowLayoutPanel1;
        private System.Windows.Forms.PictureBox pcbCam;
        private System.Windows.Forms.Timer tmReadings;
    }
}