using System;
using System.Net.Http;
using System.Text.Json;
using System.Text;
using System.Windows.Forms;
using ARKODesktop.Views.Components;
namespace ARKODesktop.Views
{
    public partial class Login : Form
    {
        bool isPasswordVisible = false;
        private StartUp startUp;
        public Login(StartUp startUp)
        {
            InitializeComponent();
            lblForgotPassword.Cursor = Cursors.Hand; 
            this.startUp = startUp;
        }

        private void lblForgotPassword_Click(object sender, EventArgs e)
        {
            ChangePassword_user frmChangePass = new ChangePassword_user();
            frmChangePass.ShowDialog();
        }

        private void btnShowPass_Click(object sender, EventArgs e)
        {
            if (!isPasswordVisible)
            {
                txtPass.PasswordChar = '\0';
                btnShowPass.BackgroundImage = Properties.Resources.view;
            }
            else
            {
                txtPass.PasswordChar = '●';
                btnShowPass.BackgroundImage = Properties.Resources.hide;
            }

            isPasswordVisible = !isPasswordVisible; // Toggle the state
        }

        async private void btnLogin_Click(object sender, EventArgs e)
        {
            using (HttpClient client = new HttpClient())
            {
                string url = "https://arkovessel.com/api/operator/loginAdmin";
                var requestData = new
                {
                    username = txtUsername.Text,
                    password = txtPass.Text
                };

                string jsonRequest = JsonSerializer.Serialize(requestData);
                StringContent content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                try
                {
                    HttpResponseMessage response = await client.PostAsync(url, content);
                    

                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    var responseData = JsonSerializer.Deserialize<loginResponse>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (responseData.Status == 200)
                    {
                        EntryForm entryForm = new EntryForm(this);
                        entryForm.Show();
                        Properties.Settings.Default.UserToken = responseData?.Token;
                        Properties.Settings.Default.Save();
                        txtUsername.Text = "";
                        txtPass.Text = "";
                        this.Hide();
                    }
                    else if (responseData.Status == 404 || responseData.Status == 403 || responseData.Status == 401)
                    {
                        MessageBox.Show("Invalid Credentials", "Login Failed", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    }
                    else
                    {
                        MessageBox.Show("Something Went Wrong. Please Try Again.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
                catch (Exception)
                {
                    MessageBox.Show("An unexpected error occurred!", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);

                }
            }
        }

        private void Login_FormClosing(object sender, FormClosingEventArgs e)
        {
            if(this.startUp  != null && !this.startUp.IsDisposed)
            {
                this.startUp.Show();
            }
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            this.startUp.Show();

            this.Close();
        }
    }
    class loginResponse
    {
        public int User_id { get; set; }
        public string Token { get; set; }
        public string Message { get; set; }
        public int Status { get; set; }
    }

}
