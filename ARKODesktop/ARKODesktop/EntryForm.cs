using System;
using System.Windows.Forms;
using System.Drawing;
using ARKODesktop.Views;
using System.Net.Http;
using System.Text.Json;
using System.Text;
using Newtonsoft.Json.Linq;

namespace ARKODesktop
{
    public partial class EntryForm : Form
    {
        private Form frmDevices;
        private Form frmOperation;
        private Form frmUserCreation;
        private Form frmUserProfile;
        private Form frmMap;

        private Login login;
        private int counter = 0;
        private int total_count = 0;
        private int current_total_count = 0;

        public EntryForm(Login login)
        {
            InitializeComponent();
            //btnDevices.Image = new Bitmap(Properties.Resources.dashboard_vessel, new Size(40, 40));
            btnLogout.Image = new Bitmap(Properties.Resources.dashboard_logout, new Size(40, 40));
            //btnUserProfile.Image = new Bitmap(Properties.Resources.dashboard_user_profile, new Size(40, 40));
            btnUser.Image = new Bitmap(Properties.Resources.dashboard_user, new Size(40, 40));
            btnOperations.Image = new Bitmap(Properties.Resources.dashboard_operations, new Size(40, 40));
            this.login = login;
            loadStrandeds();
            total_count = current_total_count;

            ShowForm(ref frmOperation, new Operation());
            this.WindowState = FormWindowState.Maximized;
            //btnDevices.Visible = false;
        }

        async private void dashTime_Tick(object sender, EventArgs e)
        {
            lblTime.Text = DateTime.Now.ToString("hh:mm:ss tt");
            counter++;
            if (counter == 10)
            {
                loadStrandeds();

                if (current_total_count > total_count)
                {
                    frmNotification notif = new frmNotification("information", "A stranded has requested an assistance.");
                    notif.ShowDialog();

                    total_count = current_total_count;
                }
                else
                {
                    total_count = current_total_count;
                }

                counter = 0;
            }
        }

        async private void loadStrandeds()
        {
            string apiUrl = "https://arkovessel.com/api/rescues/ongoing/count";

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(apiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        JObject jsonData = JObject.Parse(jsonResponse);
                        current_total_count = jsonData["total_pending"].ToObject<int>();
                    }
                    else
                    {
                        MessageBox.Show("API request failed.");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error: " + ex.Message);
            }
        } 

        public Form loadForm(Form form)
        {
            if (this.pnlLoadForm.Controls.Count > 0)
            {
                this.pnlLoadForm.Controls.RemoveAt(0);
            }

            form.TopLevel = false;
            form.Dock = DockStyle.Fill;
            this.pnlLoadForm.Controls.Add(form);
            form.Tag = form;
            form.Show();

            return form;
        }

        private void HideAllFormsExcept(Form visibleForm)
        {
            if (frmDevices != null && frmDevices != visibleForm) frmDevices.Hide();
            if (frmOperation != null && frmOperation != visibleForm) frmOperation.Hide();
            if (frmUserCreation != null && frmUserCreation != visibleForm) frmUserCreation.Hide();
            if (frmMap != null && frmMap != visibleForm) frmMap.Hide();

            if (this.pnlLoadForm.Controls.Count > 0)
            {
                this.pnlLoadForm.Controls.RemoveAt(0);
            }
            this.pnlLoadForm.Controls.Add(visibleForm);
        }

        private void ShowForm(ref Form currentForm, Form newForm)
        {

            if (currentForm == null || currentForm.IsDisposed)
            {
                currentForm = loadForm(newForm);
                
            }
            else
            {
                currentForm.Show();
            }

            HideAllFormsExcept(currentForm);
        }

        private void btnOperations_Click(object sender, EventArgs e)
        {
            ShowForm(ref frmOperation, new Operation());
            this.WindowState = FormWindowState.Maximized;
        }

        private void btnUser_Click(object sender, EventArgs e)
        {
            ShowForm(ref frmUserCreation, new OperatorCreation());
            RestoreWindowSize();
        }

        private void btnUserProfile_Click(object sender, EventArgs e)
        {
            ShowForm(ref frmUserProfile, new UserProfile());
        }

        private void btnLogout_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void EntryForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            logout();
            this.login.Show();
        }

        private void btnDevices_Click(object sender, EventArgs e)
        {
            ShowForm(ref frmDevices, new Devices());
            RestoreWindowSize();
        }

        async void logout()
        {
            using (HttpClient client = new HttpClient())
            {
                string url = "https://arkovessel.com/api/logout";
                var requestData = new { val = "" };

                string jsonRequest = JsonSerializer.Serialize(requestData);
                StringContent content = new StringContent(jsonRequest, Encoding.UTF8, "application/json");
                string token = Properties.Settings.Default.UserToken;
                client.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);

                try
                {
                    HttpResponseMessage response = await client.PostAsync(url, content);
                    response.EnsureSuccessStatusCode();

                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    var responseData = JsonSerializer.Deserialize<ServerResponse>(jsonResponse, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    MessageBox.Show($"{responseData?.message}");
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error: {ex.Message}");
                }
            }
        }
        private void RestoreWindowSize()
        {
            this.WindowState = FormWindowState.Normal;
            this.Size = new Size(1311, 759);
            this.FormBorderStyle = FormBorderStyle.FixedToolWindow; // Restore border if needed
        }

        private void EntryForm_Load(object sender, EventArgs e)
        {

        }

       
    }
}
