using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;


namespace ARKODesktop.Views
{
    public partial class ForgotPassword : Form
    {
        private bool isPasswordVisible = false;
        private string userEmail;

        public ForgotPassword()
        {
            InitializeComponent();
            btnVerify.Enabled = false;
            btnSave.Enabled = false;
        }

        private async void btnGet_Click(object sender, EventArgs e)
        {
            userEmail = txtEmail.Text.Trim();
            if (string.IsNullOrEmpty(userEmail))
            {
                MessageBox.Show("Please enter your email.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            using (HttpClient client = new HttpClient())
            {
                var data = new { email = userEmail };
                var json = JsonConvert.SerializeObject(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync("https://arkovessel.com/api/forgot", content);
                string responseBody = await response.Content.ReadAsStringAsync();

                MessageBox.Show(responseBody, "Response", MessageBoxButtons.OK, MessageBoxIcon.Information);
                btnVerify.Enabled = true;
            }
        }

        private async void btnVerify_Click(object sender, EventArgs e)
        {
            string otpCode = txtOTP.Text.Trim();
            if (string.IsNullOrEmpty(userEmail) || string.IsNullOrEmpty(otpCode))
            {
                MessageBox.Show("Please enter your email and OTP.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            using (HttpClient client = new HttpClient())
            {
                var data = new { email = userEmail, otp = otpCode };
                var json = JsonConvert.SerializeObject(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync("https://arkovessel.com/api/verify-otp", content);
                string responseBody = await response.Content.ReadAsStringAsync();

                MessageBox.Show(responseBody, "Response", MessageBoxButtons.OK, MessageBoxIcon.Information);
                btnSave.Enabled = true;
            }
        }

        private async void btnSave_Click(object sender, EventArgs e)
        {
            string newPassword = txtPass.Text.Trim();
            string confirmPassword = txtConfirmPass.Text.Trim();
            string otpCode = txtOTP.Text.Trim();

            if (string.IsNullOrEmpty(userEmail) || string.IsNullOrEmpty(otpCode) || string.IsNullOrEmpty(newPassword) || string.IsNullOrEmpty(confirmPassword))
            {
                MessageBox.Show("Please fill in all fields.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }
            if (newPassword != confirmPassword)
            {
                MessageBox.Show("Passwords do not match.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }
            if (newPassword.Length < 6)
            {
                MessageBox.Show("Password must be at least 6 characters.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            using (HttpClient client = new HttpClient())
            {
                var data = new { email = userEmail, otp = otpCode, password = newPassword, password_confirmation = confirmPassword };
                var json = JsonConvert.SerializeObject(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync("https://arkovessel.com/api/reset", content);
                string responseBody = await response.Content.ReadAsStringAsync();

                MessageBox.Show(responseBody, "Response", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        private void btnShowPass_Click(object sender, EventArgs e)
        {
            if (!isPasswordVisible)
            {
                txtPass.PasswordChar = '\0';
                txtConfirmPass.PasswordChar = '\0';
                btnShowPass.BackgroundImage = Properties.Resources.view;
            }
            else
            {
                txtPass.PasswordChar = '●';
                txtConfirmPass.PasswordChar = '●';
                btnShowPass.BackgroundImage = Properties.Resources.hide;
            }
            isPasswordVisible = !isPasswordVisible;
        }
    }
}


