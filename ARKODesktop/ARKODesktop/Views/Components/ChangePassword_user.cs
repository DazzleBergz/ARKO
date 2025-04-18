using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;


namespace ARKODesktop.Views.Components
{
    public partial class ChangePassword_user : Form
    {
        private bool isPasswordVisible = false;
        private string userEmail;
        public ChangePassword_user()
        {
            InitializeComponent();
            btnVerify.Enabled = false;
            btnSave.Enabled = false;
        }

        private void btnShowPass_Click(object sender, EventArgs e)
        {
            if (!isPasswordVisible)
            {
                txtPass.PasswordChar = '\0';
                txtConfirmPass.PasswordChar = '\0';
                btnShowPass.BackgroundImage = Properties.Resources.view; // Use embedded resource
            }
            else
            {
                txtPass.PasswordChar = '●';
                txtConfirmPass.PasswordChar = '●';
                btnShowPass.BackgroundImage = Properties.Resources.hide; // Use embedded resource
            }

            isPasswordVisible = !isPasswordVisible; // Toggle the state
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

                // Send POST request to the API to verify OTP
                HttpResponseMessage response = await client.PostAsync("https://arkovessel.com/api/verify-otp", content);
                string responseBody = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    // OTP verification successful
                    MessageBox.Show("OTP Successfully Verified", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    btnSave.Enabled = true;
                    txtPass.Enabled = true;
                    txtConfirmPass.Enabled = true;
                    btnShowPass.Enabled = true;
                }
                else
                {
                    // Handle unsuccessful response (error)
                    MessageBox.Show("Failed to verify OTP. Please check the OTP and try again.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
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

                // Send POST request to the API to reset the password
                HttpResponseMessage response = await client.PostAsync("https://arkovessel.com/api/reset", content);
                string responseBody = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    // Password reset successful
                    MessageBox.Show("Password Changed Successfully", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    this.Close();
                }
                else
                {
                    // Handle unsuccessful response (error)
                    MessageBox.Show("Failed to reset the password. Please check the OTP and try again.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
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

                try
                {
                    // Send POST request to the API
                    HttpResponseMessage response = await client.PostAsync("https://arkovessel.com/api/forgot", content);
                    string responseBody = await response.Content.ReadAsStringAsync();

                    // Handle the response based on the status code
                    if (response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("OTP Code sent to provided email", "Success", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        btnVerify.Enabled = true;
                        txtOTP.Enabled = true;
                    }
                    else if (!response.IsSuccessStatusCode) // 422 status code
                    {
                        // Parse the error response JSON
                        var errorResponse = JsonConvert.DeserializeObject<JObject>(responseBody);
                        string errorMessage = errorResponse["errors"]?["email"]?.First?.ToString();

                        // Display the validation error message
                        if (!string.IsNullOrEmpty(errorMessage))
                        {
                            MessageBox.Show($"Error: {errorMessage}", "Validation Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        }
                        else
                        {
                            MessageBox.Show("An unknown validation error occurred.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        }
                    }
                    else
                    {
                        // General error message for other failed cases
                        MessageBox.Show("An error occurred. Please try again later.", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    }
                }
                catch (Exception ex)
                {
                    // Catch network errors or unexpected exceptions
                    MessageBox.Show($"An error occurred: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }
    }
}
