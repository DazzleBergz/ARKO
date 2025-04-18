using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Windows.Forms.DataVisualization.Charting;

namespace ARKODesktop
{
    public partial class CustomMessageBox : Form
    {
        public CustomMessageBox(string title, string message)
        {
            InitializeComponent();
            lblTitle.Text = title;
            lblMessage.Text = message;

            pnlHeader.BackColor = GetTitleBarColor(title);
            pbImage.Image = GetMessageBoxImage(title);
            pbImage.SizeMode = PictureBoxSizeMode.Zoom;
        }

        private void button1_Click(object sender, EventArgs e)
        {
            this.Close();
        }
        private Color GetTitleBarColor(string title)
        {
            if (title.ToLower().Contains("danger"))
                //return Color.FromArgb(255, 128, 128); // Red
                return Color.Red;
            else if (title.ToLower().Contains("warning"))
                return Color.FromArgb(255, 192, 128); // Orange
            else if (title.ToLower().Contains("information"))
                return Color.FromArgb(128, 255, 255); // Blue
            else if (title.ToLower().Contains("success"))
                return Color.FromArgb(128, 255, 128); // Green
            else
                return Color.Gray; // Default color
        }
        private Image GetMessageBoxImage(string title)
        {
            if (title.ToLower().Contains("danger"))
                return Properties.Resources.danger;
            else if (title.ToLower().Contains("warning"))
                return Properties.Resources.warning;
            else if (title.ToLower().Contains("information"))
                return Properties.Resources.information;
            else if (title.ToLower().Contains("success"))
                return Properties.Resources.success;
            else
                return null; // No image
        }
    }
}
