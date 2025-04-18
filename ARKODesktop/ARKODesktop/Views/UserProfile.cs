using ARKODesktop.Views;
using ARKODesktop.Views.Components;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ARKODesktop
{
    public partial class UserProfile : Form
    {
        public UserProfile()
        {
            InitializeComponent();
        }

        private void UserProfile_Load(object sender, EventArgs e)
        {
            pnlShadow.BackColor = Color.FromArgb(10, Color.Black);
            pnlShadow.BackColor = Color.FromArgb(10, Color.Black);
            pnlImage.BackColor = Color.White;  // Example color
            pnlInformation.BackColor = Color.White; // Example color

            pnlShadow.Paint += new PaintEventHandler(RoundPanel_Paint);
            pnlImage.Paint += new PaintEventHandler(RoundPanel_Paint);
            pnlInformation.Paint += new PaintEventHandler(RoundPanel_Paint);

            MakeCircularPictureBox(pbProfile);
        }
        private void RoundPanel_Paint(object sender, PaintEventArgs e)
        {
            Panel panel = sender as Panel; // Get the panel that triggered the event
            if (panel == null) return;

            int cornerRadius = 20; // Adjust for roundness
            Graphics g = e.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;

            using (GraphicsPath path = new GraphicsPath())
            {
                int radius = cornerRadius * 2;

                // Create rounded rectangle path
                path.AddArc(0, 0, radius, radius, 180, 90);
                path.AddArc(panel.Width - radius, 0, radius, radius, 270, 90);
                path.AddArc(panel.Width - radius, panel.Height - radius, radius, radius, 0, 90);
                path.AddArc(0, panel.Height - radius, radius, radius, 90, 90);
                path.CloseFigure();

                panel.Region = new Region(path); // Apply rounded corners
                using (SolidBrush brush = new SolidBrush(panel.BackColor))
                {
                    g.FillPath(brush, path);
                }
            }
        }
        private void MakeCircularPictureBox(PictureBox pictureBox)
        {

            // Create a graphics path to define a circular region
            GraphicsPath path = new GraphicsPath();
            path.AddEllipse(0, 0, pictureBox.Width, pictureBox.Height);

            // Apply the circular region to the PictureBox
            pictureBox.Region = new Region(path);
        }

        private void txtContactNum_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (!char.IsControl(e.KeyChar) && !char.IsDigit(e.KeyChar))
            {
                e.Handled = true; // Ignore the input
            }
        }

        private void btnChangePassword_Click(object sender, EventArgs e)
        {
            ChangePassword_user frmChangePassword = new ChangePassword_user();
            frmChangePassword.Show();
        }

        private void btnChangeEmail_Click(object sender, EventArgs e)
        {
            ChangeEmail frmChangeEmail = new ChangeEmail();
            frmChangeEmail.Show();
        }
    }
}
