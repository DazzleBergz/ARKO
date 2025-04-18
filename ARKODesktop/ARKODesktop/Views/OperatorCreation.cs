using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SQLite;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Drawing.Drawing2D;
using ARKODesktop.Properties;
using System.Resources;
using System.Windows.Forms.DataVisualization.Charting;
using Newtonsoft.Json;
using System.Net.Http;
using Newtonsoft.Json.Linq;

namespace ARKODesktop.Views
{
    public partial class OperatorCreation : Form
    {
        public OperatorCreation()
        {
            InitializeComponent();
            _ = FetchOperators();
            //btnAdd.Enabled = false; //WAG MO KALIMUTAN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        }
        public void AddCardOperator(int userId, string type, string status, string username)
        {

            Panel pnlUserCard = new Panel();
            PictureBox pbProfile = new PictureBox();
            Label lblName = new Label();
            Label lblUserType = new Label();
            Panel pnlPlacer = new Panel();
            Label lblStatus = new Label();

            lblStatus.Dock = System.Windows.Forms.DockStyle.Fill;
            lblStatus.Location = new System.Drawing.Point(0, 0);
            lblStatus.Size = new System.Drawing.Size(130, 29);
            lblStatus.TabIndex = 0;
            lblStatus.Text = "●  " + status;
            lblStatus.TextAlign = System.Drawing.ContentAlignment.MiddleRight;
            if (lblStatus.Text.Contains("Active"))
            {
                lblStatus.ForeColor = Color.Green;
            }
            else
            {
                lblStatus.ForeColor = Color.Red;
            }

            pnlPlacer.Location = new System.Drawing.Point(207, 3);
            pnlPlacer.Size = new System.Drawing.Size(130, 29);
            pnlPlacer.TabIndex = 3;

            lblUserType.AutoSize = true;
            lblUserType.Font = new System.Drawing.Font("Cera Pro", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            lblUserType.Location = new System.Drawing.Point(162, 104);
            lblUserType.Size = new System.Drawing.Size(63, 24);
            lblUserType.TabIndex = 2;
            lblUserType.Text = type;

            lblName.AutoSize = true;
            lblName.Font = new System.Drawing.Font("Cera Pro", 14.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            lblName.Location = new System.Drawing.Point(161, 50);
            lblName.Size = new System.Drawing.Size(64, 24);
            lblName.TabIndex = 1;
            lblName.Text = username;

            pbProfile.BackgroundImage = Properties.Resources.user;
            pbProfile.BackgroundImageLayout = System.Windows.Forms.ImageLayout.Zoom;
            pbProfile.Location = new System.Drawing.Point(20, 28);
            pbProfile.Size = new System.Drawing.Size(127, 119);
            pbProfile.TabIndex = 0;
            pbProfile.TabStop = false;

            MakePictureBoxCircular(pbProfile);

            pnlUserCard.BackColor = Color.White;
            pnlUserCard.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            pnlUserCard.Location = new System.Drawing.Point(5, 5);
            pnlUserCard.Margin = new System.Windows.Forms.Padding(5);
            pnlUserCard.Size = new System.Drawing.Size(340, 181);
            pnlUserCard.TabIndex = 0;

            pnlPlacer.Controls.Add(lblStatus);
            pnlUserCard.Controls.Add(pnlPlacer);
            pnlUserCard.Controls.Add(lblUserType);
            pnlUserCard.Controls.Add(lblName);
            pnlUserCard.Controls.Add(pbProfile);
            flpUsers.Controls.Add(pnlUserCard);
        }
        private void MakePictureBoxCircular(PictureBox pictureBox)
        {
            pictureBox.SizeMode = PictureBoxSizeMode.StretchImage; // Ensures image fills the PictureBox

            GraphicsPath path = new GraphicsPath();
            path.AddEllipse(0, 0, pictureBox.Width, pictureBox.Height);
            pictureBox.Region = new Region(path);
        }
        private void btnAddUser_Click_1(object sender, EventArgs e)
        {
            OperatorCreationFields frmOperatorCreationFields = new OperatorCreationFields(this);
            frmOperatorCreationFields.Show();
            FetchOperators();
        }
        public async Task FetchOperators()
        {
            string apiUrl = "https://arkovessel.com/api/getAllOperators";
            string token = Properties.Settings.Default.UserToken;// Replace with actual API URL
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
                    HttpResponseMessage response = await client.GetAsync(apiUrl);
                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        OperatorResponse operatorData = JsonConvert.DeserializeObject<OperatorResponse>(jsonResponse);

                        if (operatorData.status == 200)
                        {
                            flpUsers.Controls.Clear(); // Clear existing items
                            foreach (var user in operatorData.data)
                            {
                                AddCardOperator(user.user_id, user.type, user.status, user.username);
                            }
                        }
                        else
                        {
                            MessageBox.Show("Failed to retrieve data: " + operatorData.message);
                        }
                    }
                    else
                    {
                        MessageBox.Show("Error: " + response.StatusCode.ToString());
                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Exception: " + ex.Message);
                }
            }
        }
        public class UserData
        {
            public int user_id { get; set; }
            public string type { get; set; }
            public string status { get; set; }
            public string username { get; set; }

        }
        public class OperatorResponse
        {
            public string message { get; set; }
            public int status { get; set; }
            public List<UserData> data { get; set; }
        }
    }
}
