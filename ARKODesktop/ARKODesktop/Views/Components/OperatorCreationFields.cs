using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ARKODesktop.Views
{
    public partial class OperatorCreationFields : Form
    {
        private OperatorCreation parentForm;
        bool isPasswordVisible = false;
        public OperatorCreationFields(OperatorCreation parent)
        {
            InitializeComponent();
            this.parentForm = parent;
        }

        private void btnCancel_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        async private void btnAdd_Click(object sender, EventArgs e)
        {
            using (HttpClient client = new HttpClient())
            {
                string url = "https://arkovessel.com/api/operator/store";

                string token = Properties.Settings.Default.UserToken;
                client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

                var requestData = new
                {
                    username = txtUsername.Text,
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

                    if (responseData.status == 201)
                    {
                        MessageBox.Show($"{responseData?.message}");

                        // Refresh the parent form to show updated operator list
                        parentForm.FetchOperators();

                        // Close and reopen the form to reset fields
                        this.Close();
                        parentForm.Show();
                        parentForm.Activate();
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
    }
}
