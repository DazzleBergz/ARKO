using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ARKODesktop.Views
{
    public partial class frmNotification : Form
    {
        public frmNotification(string title, string message)
        {
            InitializeComponent();
            lblMessage.Text = message;
            this.TopMost = true;
        }

        private void frmNotification_Load(object sender, EventArgs e)
        {

        }

        private void btnOK_Click(object sender, EventArgs e)
        {
            this.Close();
        }
        
    }
}
