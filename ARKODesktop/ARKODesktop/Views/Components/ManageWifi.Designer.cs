
namespace ARKODesktop.Views.Component
{
    partial class ManageWifi
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ManageWifi));
            this.lblInstruct = new System.Windows.Forms.Label();
            this.btnConnectNet = new System.Windows.Forms.Button();
            this.txtSSID = new System.Windows.Forms.TextBox();
            this.lblPassword = new System.Windows.Forms.Label();
            this.lblSSID = new System.Windows.Forms.Label();
            this.txtNPass = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // lblInstruct
            // 
            this.lblInstruct.AutoSize = true;
            this.lblInstruct.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.lblInstruct.Font = new System.Drawing.Font("Cera Pro", 9F, System.Drawing.FontStyle.Italic, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblInstruct.Location = new System.Drawing.Point(69, 59);
            this.lblInstruct.Name = "lblInstruct";
            this.lblInstruct.Size = new System.Drawing.Size(172, 15);
            this.lblInstruct.TabIndex = 9;
            this.lblInstruct.Text = "Change or set vessel network";
            // 
            // btnConnectNet
            // 
            this.btnConnectNet.Font = new System.Drawing.Font("Cera Pro", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.btnConnectNet.Location = new System.Drawing.Point(359, 130);
            this.btnConnectNet.Name = "btnConnectNet";
            this.btnConnectNet.Size = new System.Drawing.Size(75, 23);
            this.btnConnectNet.TabIndex = 10;
            this.btnConnectNet.Text = "Connect";
            this.btnConnectNet.UseVisualStyleBackColor = true;
            // 
            // txtSSID
            // 
            this.txtSSID.Font = new System.Drawing.Font("Cera Pro", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtSSID.Location = new System.Drawing.Point(135, 91);
            this.txtSSID.Name = "txtSSID";
            this.txtSSID.Size = new System.Drawing.Size(163, 21);
            this.txtSSID.TabIndex = 6;
            // 
            // lblPassword
            // 
            this.lblPassword.AutoSize = true;
            this.lblPassword.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.lblPassword.Font = new System.Drawing.Font("Cera Pro", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblPassword.Location = new System.Drawing.Point(69, 140);
            this.lblPassword.Name = "lblPassword";
            this.lblPassword.Size = new System.Drawing.Size(56, 14);
            this.lblPassword.TabIndex = 9;
            this.lblPassword.Text = "Password";
            // 
            // lblSSID
            // 
            this.lblSSID.AutoSize = true;
            this.lblSSID.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.lblSSID.Font = new System.Drawing.Font("Cera Pro", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.lblSSID.Location = new System.Drawing.Point(69, 98);
            this.lblSSID.Name = "lblSSID";
            this.lblSSID.Size = new System.Drawing.Size(30, 14);
            this.lblSSID.TabIndex = 7;
            this.lblSSID.Text = "SSID";
            // 
            // txtNPass
            // 
            this.txtNPass.Font = new System.Drawing.Font("Cera Pro", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.txtNPass.Location = new System.Drawing.Point(135, 134);
            this.txtNPass.Name = "txtNPass";
            this.txtNPass.PasswordChar = '*';
            this.txtNPass.Size = new System.Drawing.Size(163, 21);
            this.txtNPass.TabIndex = 8;
            // 
            // ManageWifi
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackgroundImage = ((System.Drawing.Image)(resources.GetObject("$this.BackgroundImage")));
            this.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Stretch;
            this.ClientSize = new System.Drawing.Size(471, 218);
            this.Controls.Add(this.lblInstruct);
            this.Controls.Add(this.btnConnectNet);
            this.Controls.Add(this.txtNPass);
            this.Controls.Add(this.txtSSID);
            this.Controls.Add(this.lblSSID);
            this.Controls.Add(this.lblPassword);
            this.DoubleBuffered = true;
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Name = "ManageWifi";
            this.Text = "ManageWifi";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label lblInstruct;
        private System.Windows.Forms.Button btnConnectNet;
        private System.Windows.Forms.TextBox txtSSID;
        private System.Windows.Forms.Label lblPassword;
        private System.Windows.Forms.Label lblSSID;
        private System.Windows.Forms.TextBox txtNPass;
    }
}