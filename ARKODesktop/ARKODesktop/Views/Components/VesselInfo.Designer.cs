namespace ARKODesktop.Views
{
    partial class VesselInfo
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
            this.lblIP = new System.Windows.Forms.Label();
            this.lblNetwork = new System.Windows.Forms.Label();
            this.lblVesselName = new System.Windows.Forms.Label();
            this.btnAddDevice = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // lblIP
            // 
            this.lblIP.AutoSize = true;
            this.lblIP.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.lblIP.Font = new System.Drawing.Font("Cera Pro", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblIP.Location = new System.Drawing.Point(100, 95);
            this.lblIP.Name = "lblIP";
            this.lblIP.Size = new System.Drawing.Size(70, 15);
            this.lblIP.TabIndex = 12;
            this.lblIP.Text = "IP Address: ";
            // 
            // lblNetwork
            // 
            this.lblNetwork.AutoSize = true;
            this.lblNetwork.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.lblNetwork.Font = new System.Drawing.Font("Cera Pro", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblNetwork.Location = new System.Drawing.Point(100, 67);
            this.lblNetwork.Name = "lblNetwork";
            this.lblNetwork.Size = new System.Drawing.Size(60, 15);
            this.lblNetwork.TabIndex = 11;
            this.lblNetwork.Text = "Network: ";
            // 
            // lblVesselName
            // 
            this.lblVesselName.AutoSize = true;
            this.lblVesselName.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.lblVesselName.Font = new System.Drawing.Font("Cera Pro", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblVesselName.Location = new System.Drawing.Point(100, 36);
            this.lblVesselName.Name = "lblVesselName";
            this.lblVesselName.Size = new System.Drawing.Size(81, 15);
            this.lblVesselName.TabIndex = 9;
            this.lblVesselName.Text = "Vessel Name: ";
            // 
            // btnAddDevice
            // 
            this.btnAddDevice.Font = new System.Drawing.Font("Cera Pro", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnAddDevice.Location = new System.Drawing.Point(324, 132);
            this.btnAddDevice.Name = "btnAddDevice";
            this.btnAddDevice.Size = new System.Drawing.Size(126, 23);
            this.btnAddDevice.TabIndex = 10;
            this.btnAddDevice.Text = "Add to Devices";
            this.btnAddDevice.UseVisualStyleBackColor = true;
            // 
            // VesselInfo
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackgroundImage = global::ARKODesktop.Properties.Resources.BgDefault;
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(462, 167);
            this.Controls.Add(this.lblIP);
            this.Controls.Add(this.lblNetwork);
            this.Controls.Add(this.lblVesselName);
            this.Controls.Add(this.btnAddDevice);
            this.DoubleBuffered = true;
            this.Name = "VesselInfo";
            this.Text = "VesselInfo";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lblIP;
        private System.Windows.Forms.Label lblNetwork;
        private System.Windows.Forms.Label lblVesselName;
        private System.Windows.Forms.Button btnAddDevice;
    }
}