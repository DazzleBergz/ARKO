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
    public partial class StartUp : Form
    {
        public StartUp()
        {
            InitializeComponent();
        }

        private void btnLogin_Click(object sender, EventArgs e)
        {
            Login frmLogin = new Login(this);
            frmLogin.Show();
            this.Hide();

        }

        private void SignUp_Click(object sender, EventArgs e)
        {
            SignUp frmSignup = new SignUp(this);
            frmSignup.Show();
            this.Hide();
        }
    }
}
