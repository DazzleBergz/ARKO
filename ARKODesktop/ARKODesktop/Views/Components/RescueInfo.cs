using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Windows.Forms;
using static ARKODesktop.Views.RescueInfo;

namespace ARKODesktop.Views
{
    public partial class RescueInfo : Form
    {
        private int strandedId;
        private int user_id;
        private readonly string baseApiUrl = "https://arkovessel.com/api";
        private int count = 0;
        private List<string> base64Images;

        public RescueInfo(int strandedId, int pinned_by)
        {
            InitializeComponent();
            this.strandedId = strandedId;
            this.user_id = pinned_by;
            LoadUserInfo();
            LoadRescueDetails();
        }

        private async void LoadUserInfo()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    string apiUrl = $"{baseApiUrl}/userinfos/{user_id}";
                    HttpResponseMessage response = await client.GetAsync(apiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        var apiResponse = JsonSerializer.Deserialize<ApiResponse>(jsonResponse, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                        if (apiResponse?.data != null)
                        {
                            lblName.Text = $"{apiResponse.data.f_name} {apiResponse.data.m_name} {apiResponse.data.l_name}".Trim();
                        }
                        else
                        {
                            MessageBox.Show("User info not found in response.");
                        }
                    }
                    else
                    {
                        MessageBox.Show($"Failed to fetch user info. Status Code: {response.StatusCode}");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error fetching user info: " + ex.Message);
            }
        }

        private async void LoadRescueDetails()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    string apiUrl = $"{baseApiUrl}/rescues/{strandedId}";
                    HttpResponseMessage response = await client.GetAsync(apiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        var rescueDetails = JsonSerializer.Deserialize<RescueDetails>(jsonResponse, new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        });

                        if (rescueDetails != null)
                        {
                            lblDescription.Text = rescueDetails.description;
                            lblRescueType.Text = rescueDetails.type;
                            lblPeopleCount.Text = rescueDetails.number;
                            lblDateReq.Text = DateTime.TryParse(rescueDetails.created_at, out DateTime formattedDate)
                                ? formattedDate.ToString("yyyy-MM-dd HH:mm")
                                : "Invalid Date";

                            // Load images if available
                            if (!string.IsNullOrEmpty(rescueDetails.image))
                            {
                                LoadRescueImages(rescueDetails.stranded_id);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error fetching rescue details: " + ex.Message);
            }
        }
        
        private async void LoadRescueImages(int strandedId)
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    string imageUrl = $"{baseApiUrl}/rescues/showimage/{strandedId}";
                    HttpResponseMessage response = await client.GetAsync(imageUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string htmlContent = await response.Content.ReadAsStringAsync();

                        // Extract Base64 Images
                        base64Images = ExtractBase64Images(htmlContent);

                        // Load images into PictureBoxes
                        if (base64Images.Count > 0) LoadBase64ImageToPictureBox(base64Images[0], pbImage);
                    }
                    else
                    {
                        MessageBox.Show($"Failed to load rescue images. Status Code: {response.StatusCode}");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error loading images: " + ex.Message);
            }
        }

        private void LoadBase64ImageToPictureBox(string base64, PictureBox pictureBox)
        {
            try
            {
                byte[] imageBytes = Convert.FromBase64String(base64);
                using (MemoryStream ms = new MemoryStream(imageBytes))
                {
                    Image loadedImage = Image.FromStream(ms);
                    pictureBox.Image = loadedImage;
                    pictureBox.SizeMode = PictureBoxSizeMode.Zoom;
                }
            }
            catch (Exception ex)
            {
                pictureBox.Image = null;
                MessageBox.Show("Error converting Base64 image: " + ex.Message, "Image Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

            bool hasImage = pictureBox.Image != null;
            btnNext.Enabled = hasImage;
            btnPrevious.Enabled = hasImage;
        }


        private List<string> ExtractBase64Images(string htmlContent)
        {
            List<string> base64Images = new List<string>();
            string pattern = @"data:image\/jpeg;base64,([^'""]+)"; // Regex to find Base64

            var matches = System.Text.RegularExpressions.Regex.Matches(htmlContent, pattern);

            foreach (System.Text.RegularExpressions.Match match in matches)
            {
                if (match.Groups.Count > 1)
                {
                    base64Images.Add(match.Groups[1].Value);
                }
            }

            return base64Images;
        }


        public class RescueDetails
        {
            public int stranded_id { get; set; }
            public string description { get; set; }
            public string type { get; set; }
            public string number { get; set; }
            public string created_at { get; set; }
            public string image { get; set; } 
        }

        public class ApiResponse
        {
            public UserInfo data { get; set; } 
        }

        public class UserInfo
        {
            public string f_name { get; set; }
            public string l_name { get; set; }
            public string m_name { get; set; }
        }

        public class ImageResponse
        {
            public List<ImageData> images { get; set; }
        }

        public class ImageData
        {
            public string url { get; set; }
            public string mime_type { get; set; }
        }

        private void btnNext_Click(object sender, EventArgs e)
        {
            if (base64Images.Count == 0) return; // Prevent errors if the list is empty

            count = (count + 1) % base64Images.Count; // Move to the next image, looping back to 0

            LoadBase64ImageToPictureBox(base64Images[count], pbImage);
        }

        private void btnPrevious_Click(object sender, EventArgs e)
        {
            if (base64Images.Count == 0) return; // Prevent errors if the list is empty

            count = (count - 1 + base64Images.Count) % base64Images.Count; // Move to previous image, looping back

            LoadBase64ImageToPictureBox(base64Images[count], pbImage);
        }
    }
}
