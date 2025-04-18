using System;
using System.Net.Http;
using System.Text.Json;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Text;
using System.Windows.Forms;

namespace ARKODesktop.Views
{
    public partial class SignUp : Form
    {
        private StartUp startUp;
        bool isPasswordVisible = false;
        public SignUp(StartUp startUp)
        {
            InitializeComponent();
            this.startUp = startUp; 
        }

        async private void btnRegister_Click(object sender, EventArgs e)
        {
            using (HttpClient client = new HttpClient())
            {
                string url = "https://arkovessel.com/api/register";
                var requestData = new
                {
                    username = txtUsername.Text,
                    password = txtPassword.Text,
                    password_confirmation = txtConfirmPass.Text,
                    email = txtEmail.Text,
                    type = "Admin",
                    otp = txtOTP.Text
                };

                string jsonRequest = JsonSerializer.Serialize(requestData);
                StringContent content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                try
                {
                    HttpResponseMessage response = await client.PostAsync(url, content);
                    response.EnsureSuccessStatusCode();

                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    var responseData = JsonSerializer.Deserialize<ServerResponse>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (responseData.status == 200)
                    {
                        MessageBox.Show($"{responseData?.message}");
                        this.Close();
                    }
                    else
                    {
                        MessageBox.Show($"{responseData?.message}");
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error: {ex.Message}");
                }
            }
        }

        async private void btnGetCode_Click(object sender, EventArgs e)
        {
            using (HttpClient client = new HttpClient())
            {
                string url = "https://arkovessel.com/api/request-otp";
                var requestData = new
                {
                    email = txtEmail.Text,
                };

                string jsonRequest = JsonSerializer.Serialize(requestData);
                StringContent content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                try
                {
                    HttpResponseMessage response = await client.PostAsync(url, content);
                    response.EnsureSuccessStatusCode();

                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    var responseData = JsonSerializer.Deserialize<ServerResponse>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    txtOTP.Enabled = true;
                    btnVerify.Enabled = true;
                    if (responseData.status == 200)
                    {
                        MessageBox.Show($"{responseData?.message}");
                    }
                    else
                    {
                        MessageBox.Show($"{responseData?.message}");
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error: {ex.Message}");
                }
            }
        }

        async private void btnVerify_Click(object sender, EventArgs e)
        {
            using (HttpClient client = new HttpClient())
            {
                string url = "https://arkovessel.com/api/verify-otp";
                var requestData = new
                {
                    email = txtEmail.Text,
                    otp = txtOTP.Text
                };

                string jsonRequest = JsonSerializer.Serialize(requestData);
                StringContent content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");

                try
                {
                    HttpResponseMessage response = await client.PostAsync(url, content);
                    response.EnsureSuccessStatusCode();

                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    var responseData = JsonSerializer.Deserialize<ServerResponse>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (responseData.status == 200)
                    {
                        MessageBox.Show($"{responseData?.message}");
                        btnRegister.Enabled = true;
                    }
                    else
                    {
                        MessageBox.Show($"{responseData?.message}");
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error: {ex.Message}");
                }
            }
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void SignUp_FormClosing(object sender, FormClosingEventArgs e)
        {
            this.startUp.Show();
        }

        private void btnShowPass_Click(object sender, EventArgs e)
        {
            if (!isPasswordVisible)
            {
                txtPassword.PasswordChar = '\0';
                txtConfirmPass.PasswordChar = '\0';
                btnShowPass.BackgroundImage = Properties.Resources.view;
            }
            else
            {
                txtPassword.PasswordChar = '●';
                txtConfirmPass.PasswordChar = '●';
                btnShowPass.BackgroundImage = Properties.Resources.hide;
            }

            isPasswordVisible = !isPasswordVisible;
        }
    }

    class ServerResponse
    {
        public string message { get; set; }
        public int status { get; set; }
    }
}
