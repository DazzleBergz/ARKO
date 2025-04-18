using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net.Http;
using System.Text.Json;


namespace ARKODesktop.Views
{
    public partial class UpdateStatus : Form
    {
        private int strandedId;
        private string token;
        private Operation parentForm;


        public UpdateStatus(int strandedId, Operation parent)
        {
            InitializeComponent();
            this.strandedId = strandedId;
            this.token = Properties.Settings.Default.UserToken;
            this.parentForm = parent;
        }

        private async void btnSave_Click(object sender, EventArgs e)
        {
            
        }
        private async void btnSave_Click_1(object sender, EventArgs e)
        {
            string newStatus = cmbStatus.Text.Trim(); // Get status from TextBox

            if (string.IsNullOrEmpty(newStatus))
            {
                MessageBox.Show("Please enter a status.");
                return;
            }

            await UpdateRescueStatus(newStatus);
        }

        private async Task UpdateRescueStatus(string status)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization =
                        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                    string apiUrl = $"http://arkovessel.com/api/rescues/update/{strandedId}";

                    var payload = new { status = status };
                    string jsonPayload = JsonSerializer.Serialize(payload);
                    var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                    var request = new HttpRequestMessage(new HttpMethod("PATCH"), apiUrl) { Content = content };

                    HttpResponseMessage response = await client.SendAsync(request);
                    string responseContent = await response.Content.ReadAsStringAsync();

                    if (response.IsSuccessStatusCode)
                    {
                        

                        // 🔄 Refresh the content in the cards after update
                        parentForm.FetchAndDisplayRequests();

                        this.Close(); // Close form after update
                        //parentForm.BringToFront();
                        parentForm.Activate();
                        MessageBox.Show("Status updated successfully!");
                    }
                    else
                    {
                        MessageBox.Show("Failed to update status.");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error: " + ex.Message);
            }
        }


    }
}
