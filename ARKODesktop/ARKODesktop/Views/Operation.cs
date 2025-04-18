using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using GMap.NET;
using GMap.NET.MapProviders;
using GMap.NET.WindowsForms;
using GMap.NET.WindowsForms.Markers;
using System.Device.Location;
using System.Net.Http;
using System.Text.Json;
using System.Data.SQLite;
using Newtonsoft.Json.Linq;
using System.Text.Json.Serialization;
using ARKODesktop.Models;

namespace ARKODesktop.Views
{

   
    public partial class Operation : Form
    {
        private GMarkerGoogle _vesselMark;

        private GMapOverlay markersOverlay = new GMapOverlay("markers");

        private List<RescueRequest> allRequests = new List<RescueRequest>();
        public Operation()
        {
            InitializeComponent();
            LoadWaterLevels();
            gMap.Overlays.Add(markersOverlay);
        }

        public void AddCardOperations(RescueRequest request)
        {
            Panel pnlOperations = new Panel();
            Panel pnlSideBar = new Panel();
            Label lblOperationID = new Label();
            Label lblCategoryName = new Label();
            Label lblDate = new Label();
            Label lblDate_Content = new Label();
            Label lblStatus = new Label();
            Label lblNumberOfStranded = new Label();
            Label lblCategory = new Label();
            Label lblStatus_Content = new Label();
            Button btnShow = new Button();
            Button btnUpdate = new Button();

            if (request.status == "Completed")
            {
                btnUpdate.Enabled = false; // Optional: Change color to indicate disabled state
            }

            // Set values from API response
            lblOperationID.Text = "ID: " + request.id;
            lblDate.Text = "Date: ";
            lblDate_Content.Text = request.created_at;
            lblCategory.Text = "Category: ";
            lblCategoryName.Text = request.type;
            lblNumberOfStranded.Text = "Stranded: " + request.number_of_stranded;
            lblStatus.Text = "Status: ";
            lblStatus_Content.Text = request.status;

            // Set panel properties
            pnlOperations.BackColor = SystemColors.ControlLightLight;
            pnlOperations.Size = new Size(248, 190);
            pnlOperations.Margin = new Padding(5);

            // Sidebar for category color coding
            pnlSideBar.Dock = System.Windows.Forms.DockStyle.Left;
            pnlSideBar.Location = new System.Drawing.Point(0, 0);
            pnlSideBar.Size = new System.Drawing.Size(11, 190);
            pnlSideBar.TabIndex = 0;

            if (request.type == "SOS")
                pnlSideBar.BackColor = Color.FromArgb(255, 128, 128);
            else
                pnlSideBar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(192)))), ((int)(((byte)(128)))));

            // Label styles
            lblOperationID.AutoSize = true;
            lblOperationID.Font = new Font("Cera Pro", 14.25F, FontStyle.Regular);
            lblOperationID.Location = new Point(15, 4);

            lblDate.AutoSize = true;
            lblDate.Font = new Font("Cera Pro", 9.75F, FontStyle.Regular);
            lblDate.Location = new Point(15, 42);

            lblDate_Content.Font = new Font("Cera Pro", 9.75F, FontStyle.Regular);
            lblDate_Content.Location = new Point(55, 42);
            DateTime createdAt;
            if (DateTime.TryParse(request.created_at, out createdAt))
            {
                lblDate_Content.Text = createdAt.ToString("yyyy-MM-dd"); // Format: YYYY-MM-DD
            }
            else
            {
                lblDate_Content.Text = "Invalid Date"; // Handle parsing error
            }

            lblCategory.AutoSize = true;
            lblCategory.TabIndex = 5;
            lblCategory.Font = new Font("Cera Pro", 9.75F, FontStyle.Regular);
            lblCategory.Location = new Point(15, 75);

            lblCategoryName.Font = new Font("Cera Pro", 9.75F, FontStyle.Regular);
            lblCategoryName.Location = new Point(85, 75);
            lblCategoryName.ForeColor = System.Drawing.Color.Black;

            lblNumberOfStranded.Font = new Font("Cera Pro", 9.75F, FontStyle.Regular);
            lblNumberOfStranded.Location = new Point(15, 139);

            lblStatus.Font = new Font("Cera Pro", 9.75F, FontStyle.Regular);
            lblStatus.Location = new Point(15, 108);

            lblStatus_Content.Font = new Font("Cera Pro", 9.75F, FontStyle.Regular);
            lblStatus_Content.Location = new Point(70, 108);

            // Change text color based on status
            if (request.status == "En Route")
                lblStatus_Content.ForeColor = Color.Orange;
            else if (request.status == "Completed")
                lblStatus_Content.ForeColor = Color.Green;

            // Show button
            btnShow.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(83)))), ((int)(((byte)(168)))), ((int)(((byte)(207)))));
            btnShow.ForeColor = Color.White;
            btnShow.FlatAppearance.BorderSize = 0;
            btnShow.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            btnShow.TabIndex = 5;
            btnShow.TabStop = false;
            btnShow.UseVisualStyleBackColor = false;
            btnShow.Text = "Show";
            btnShow.Location = new Point(170, 4);
            btnShow.Size = new Size(75, 23);

            btnShow.Click += (sender, e) =>
            {
                RescueInfo frmRescueInfo = new RescueInfo(request.id, request.pinned_by);
                frmRescueInfo.ShowDialog();
            };

            // Update button
            btnUpdate.FlatAppearance.BorderSize = 0;
            btnUpdate.TabStop = false;
            btnUpdate.Text = "Update";
            btnUpdate.ForeColor = Color.White;
            btnUpdate.BackColor = Color.FromArgb(17, 53, 71);
            btnUpdate.FlatStyle = FlatStyle.Flat;
            btnUpdate.Location = new Point(170, 164);
            btnUpdate.Size = new Size(75, 23);

            btnUpdate.Click += (sender, e) =>
            {
                UpdateStatus frmUpdateStatus = new UpdateStatus(request.id, this);
                frmUpdateStatus.ShowDialog();
            };

            pnlOperations.Click += async (sender, e) =>
            {
                await DrawRouteToLocation(request.latitude, request.longitude);
                CenterAndZoomOnDevice(request.latitude, request.longitude);
            };

            // Add controls to panel
            pnlOperations.Controls.Add(btnUpdate);
            pnlOperations.Controls.Add(pnlSideBar);
            pnlOperations.Controls.Add(lblCategory);
            pnlOperations.Controls.Add(lblCategoryName);
            pnlOperations.Controls.Add(lblStatus_Content);
            pnlOperations.Controls.Add(lblStatus);
            pnlOperations.Controls.Add(lblNumberOfStranded);
            pnlOperations.Controls.Add(lblDate_Content);
            pnlOperations.Controls.Add(lblDate);
            pnlOperations.Controls.Add(lblOperationID);
            pnlOperations.Controls.Add(btnShow);

            // Add panel to flow layout panel
            flpOperations.Controls.Add(pnlOperations);
        }

        private void CenterAndZoomOnDevice(double latitude, double longitude)
        {
            gMap.Position = new PointLatLng(latitude, longitude);
            gMap.Zoom = 18; // Zoom into street level
        }

        private void btnShow_Click(object sender, EventArgs e)
        {
            //RescueInfo frmRescueInfo = new RescueInfo();
            //frmRescueInfo.Show();
        }

        private void btnUpdate_Click(object sender, EventArgs e)
        {
            //UpdateStatus frmUpdateStatus = new UpdateStatus();
            //frmUpdateStatus.Show();
        }

        private async Task InitializeMap()
        {
            gMap.MapProvider = GMapProviders.GoogleMap;
            gMap.MinZoom = 5;
            gMap.MaxZoom = 20;
            gMap.Zoom = 12;

            gMap.CanDragMap = true;
            gMap.DragButton = MouseButtons.Left;
            gMap.MouseWheelZoomType = MouseWheelZoomType.MousePositionAndCenter;
            gMap.IgnoreMarkerOnMouseWheel = true;
            gMap.ShowCenter = false;

            // Fetch and set vessel location first
            await FetchAndSetVesselLocation();

            // If no vessel, center on the first rescue request
            if (_vesselMark == null)
            {
                CenterOnFirstRequest();
            }

            // Perform a gradual zoom
            for (int zoomLevel = 10; zoomLevel <= 15; zoomLevel++)
            {
                await Task.Delay(50);
                gMap.Zoom = zoomLevel;
            }
        }

        private void Operation_Load(object sender, EventArgs e)
        {
            comboBox1.SelectedIndex = 0;
            InitializeMap();
            FetchAndDisplayRequests();
        }

        private async void chart1_Click(object sender, EventArgs e)
        {
            await LoadWaterLevels();
        }

        public void AddMarkerToMap(double latitude, double longitude, string type)
        {
            Bitmap pinImage = type == "SOS"
            ? new Bitmap(Properties.Resources.sos_pin, new Size(50, 50))
            : new Bitmap(Properties.Resources.other_pin, new Size(50, 50));

            markersOverlay.Markers.Add(new GMarkerGoogle(new PointLatLng(latitude, longitude), pinImage));
            gMap.Refresh();
        }

        private async Task DrawRouteToLocation(double destinationLat, double destinationLng)
        {
            try
            {
                if (_vesselMark == null)
                {
                    MessageBox.Show("Vessel location not available.");
                    return;
                }

                string apiUrl = $"https://router.project-osrm.org/route/v1/foot/{_vesselMark.Position.Lng},{_vesselMark.Position.Lat};{destinationLng},{destinationLat}?overview=full";

                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(apiUrl);
                    if (!response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("Failed to fetch route.");
                        return;
                    }

                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    JObject json = JObject.Parse(jsonResponse);

                    if (json["routes"] != null && json["routes"].Any())
                    {
                        markersOverlay.Routes.Clear();
                        var decodedRoute = DecodePolyline(json["routes"][0]["geometry"].ToString());

                        markersOverlay.Routes.Add(new GMapRoute(decodedRoute, "Rescue Route")
                        {
                            Stroke = new Pen(Color.OrangeRed, 3)
                        });

                        gMap.Refresh();
                    }
                    else
                    {
                        MessageBox.Show("No route found.");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error drawing route: " + ex.Message);
            }
        }

        private List<PointLatLng> DecodePolyline(string encodedPoints)
        {
            if (string.IsNullOrEmpty(encodedPoints)) return new List<PointLatLng>();

            List<PointLatLng> poly = new List<PointLatLng>();
            int index = 0, lat = 0, lng = 0;

            while (index < encodedPoints.Length)
            {
                int b, shift = 0, result = 0;
                do
                {
                    b = encodedPoints[index++] - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);
                lat += (result & 1) != 0 ? ~(result >> 1) : (result >> 1);

                shift = 0; result = 0;
                do
                {
                    b = encodedPoints[index++] - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);
                lng += (result & 1) != 0 ? ~(result >> 1) : (result >> 1);

                poly.Add(new PointLatLng(lat / 1E5, lng / 1E5));
            }
            return poly;
        }

        public async Task FetchAndDisplayRequests()
        {
            await FetchAndSetVesselLocation();

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync("http://arkovessel.com/api/allRequest");

                    if (!response.IsSuccessStatusCode)
                    {
                        MessageBox.Show("Failed to fetch rescue requests.");
                        return;
                    }

                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    var jsonDoc = JsonDocument.Parse(jsonResponse);

                    if (!jsonDoc.RootElement.TryGetProperty("data", out var dataElement) || dataElement.ValueKind != JsonValueKind.Array)
                    {
                        MessageBox.Show("Error: 'data' key not found or is not an array.");
                        return;
                    }

                    allRequests.Clear();
                    foreach (var request in dataElement.EnumerateArray())
                    {
                        allRequests.Add(new RescueRequest
                        {
                            id = request.GetProperty("stranded_id").GetInt32(),
                            type = request.GetProperty("type").GetString(),
                            status = request.GetProperty("status").GetString(),
                            number_of_stranded = request.TryGetProperty("number", out var numberElement) && numberElement.ValueKind == JsonValueKind.String
                                ? int.TryParse(numberElement.GetString(), out int num) ? num : (int?)null
                                : null,
                            latitude = double.Parse(request.GetProperty("latitude").GetString()),
                            longitude = double.Parse(request.GetProperty("longitude").GetString()),
                            created_at = request.GetProperty("created_at").GetString(),
                            pinned_by = int.Parse(request.GetProperty("pinned_by").GetString()),
                        });
                    }

                    // After fetching and displaying requests, center map on the first request
                    CenterOnFirstRequest();

                    FilterRequestsByStatus(comboBox1.SelectedItem.ToString());
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Error: " + ex.Message);
            }
        }

        private async Task FetchAndSetVesselLocation()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync("https://arkovessel.com/api/vessels/vesselCoordinates/1");
                    if (!response.IsSuccessStatusCode) return;

                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    var jsonDoc = JsonDocument.Parse(jsonResponse);
                    if (!jsonDoc.RootElement.TryGetProperty("data", out var vesselElement)) return;

                    double latitude = double.Parse(vesselElement.GetProperty("latitude").GetString());
                    double longitude = double.Parse(vesselElement.GetProperty("longitude").GetString());
                    string vesselName = vesselElement.GetProperty("vessel_name").GetString();

                    gMap.Position = new PointLatLng(latitude, longitude);
                    Bitmap customMarkerImage = new Bitmap(Properties.Resources.boat, new Size(50, 50));
                    _vesselMark = new GMarkerGoogle(new PointLatLng(latitude, longitude), customMarkerImage)
                    {
                        ToolTipMode = MarkerTooltipMode.OnMouseOver,
                        ToolTipText = vesselName
                    };

                    markersOverlay.Markers.Add(_vesselMark);
                    gMap.Refresh();
                }
            }
            catch (Exception ex)
            {
                double defaultLat = 14.6617;
                double defaultLng = 120.9948;

                gMap.Position = new PointLatLng(defaultLat, defaultLng);
                gMap.Refresh();
                Console.WriteLine("Error fetching vessel location: " + ex.Message);
            }
        }

        public async Task updateVesselPosition()
        {
            try
            {
                using (HttpClient client = new HttpClient())
                {
                    string vesselApiUrl = "https://arkovessel.com/api/vessels/vesselCoordinates/2";
                    HttpResponseMessage response = await client.GetAsync(vesselApiUrl);
                    string jsonResponse = await response.Content.ReadAsStringAsync();

                    if (!response.IsSuccessStatusCode)
                    {
                        return;
                    }

                    var jsonDoc = JsonDocument.Parse(jsonResponse);
                    if (!jsonDoc.RootElement.TryGetProperty("data", out var vesselElement))
                    {
                        MessageBox.Show("Error: 'data' key not found in vessel API response.");
                        return;
                    }

                    double latitude = double.Parse(vesselElement.GetProperty("latitude").GetString());
                    double longitude = double.Parse(vesselElement.GetProperty("longitude").GetString());

                    if (_vesselMark != null)
                    {
                        _vesselMark.Position = new PointLatLng(latitude, longitude);
                        gMap.Refresh();
                    }
                }
            }
            catch (Exception ex)
            {

                MessageBox.Show("Error: " + ex.Message);
            }
            
        }

        public async Task AddVesselMarker()
        {
            //await FetchAndDisplayRequests();
            await FetchAndSetVesselLocation();
        }

        private async Task LoadWaterLevels()
        {
            string apiUrl = "https://arkovessel.com/api/water-levels";

            try
            {
                using (HttpClient client = new HttpClient())
                {
                    HttpResponseMessage response = await client.GetAsync(apiUrl);

                    if (response.IsSuccessStatusCode)
                    {
                        string jsonResponse = await response.Content.ReadAsStringAsync();
                        JObject jsonData = JObject.Parse(jsonResponse);

                        if ((bool)jsonData["success"])
                        {
                            var waterLevels = jsonData["data"];
                            chart1.Series.Clear();
                            chart1.Series.Add("Water Level");
                            chart1.Series["Water Level"].ChartType = System.Windows.Forms.DataVisualization.Charting.SeriesChartType.Line;

                            int index = 1;
                            foreach (var item in waterLevels)
                            {
                                double level = Convert.ToDouble(item["level"]);
                                chart1.Series["Water Level"].Points.AddXY(index, level);
                                index++;
                            }
                        }
                        else
                        {
                            MessageBox.Show("Failed to fetch water levels.");
                        }
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

        private void button1_Click(object sender, EventArgs e)
        {
            markersOverlay.Routes.Clear(); // Remove all route lines
            FetchAndDisplayRequests();
        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            string selectedStatus = comboBox1.SelectedItem.ToString();
            FilterRequestsByStatus(selectedStatus);
        }

        private void FilterRequestsByStatus(string status)
        {
            double currentZoom = gMap.Zoom;
            PointLatLng currentPosition = gMap.Position;

            flpOperations.Controls.Clear();
            markersOverlay.Markers.Clear();

            bool firstRequest = true;

            foreach (var request in allRequests)
            {
                if (status == "All" || request.status == status)
                {
                    AddCardOperations(request);
                    AddMarkerToMap(request.latitude, request.longitude, request.type);

                    if (firstRequest)
                    {
                        currentPosition = new PointLatLng(request.latitude, request.longitude);
                        firstRequest = false;
                    }
                }
            }

            _ = AddVesselMarker();

            gMap.Position = currentPosition;
            gMap.Zoom = currentZoom;

            markersOverlay.Routes.Clear();
            gMap.Refresh();
        }

        private async void updateTimer_Tick(object sender, EventArgs e)
        {
            await updateVesselPosition();
        }

        private void CenterOnFirstRequest()
        {
            if (allRequests.Count > 0)
            {
                var firstRequest = allRequests[0]; // Get the first request
                gMap.Position = new PointLatLng(firstRequest.latitude, firstRequest.longitude);
            }
            else
            {
                // Default coordinates if no request is available
                double defaultLat = 14.6617;
                double defaultLng = 120.9948;
                gMap.Position = new PointLatLng(defaultLat, defaultLng);
            }
        }

        public class RescueRequest
        {
            public int id { get; set; }
            public string type { get; set; }
            public string status { get; set; }
            public int? number_of_stranded { get; set; } // Changed to string
            public double latitude { get; set; }
            public double longitude { get; set; }
            public string created_at { get; set; }
            public int pinned_by { get; set; }
        }
    }
}
