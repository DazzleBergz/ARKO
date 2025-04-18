using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GMap.NET;
using GMap.NET.MapProviders;
using GMap.NET.WindowsForms;
using System.Device.Location;
using System.Windows.Forms;

namespace ARKODesktop.Views
{
    public partial class Map : Form
    {
        public Map()
        {
            InitializeComponent();
            InitializeMap();
        }

        private void InitializeMap()
        {
            gMap.MapProvider = GMapProviders.GoogleMap;
            gMap.Position = new PointLatLng(0, 0); // Default position
            gMap.MinZoom = 15;
            gMap.MaxZoom = 20;
            gMap.Zoom = 17;

            gMap.CanDragMap = true;
            gMap.DragButton = MouseButtons.Left;
            gMap.MouseWheelZoomType = MouseWheelZoomType.MousePositionAndCenter;
            gMap.IgnoreMarkerOnMouseWheel = true;
            gMap.ShowCenter = true;
        }

        private void CenterMapOnDevice(double latitude, double longitude)
        {
            gMap.Position = new PointLatLng(latitude, longitude);
        }

        private void GetDeviceLocation()
        {
            GeoCoordinateWatcher watcher = new GeoCoordinateWatcher();

            watcher.PositionChanged += (sender, e) =>
            {
                var location = e.Position.Location;
                if (!location.IsUnknown)
                {
                    double latitude = location.Latitude;
                    double longitude = location.Longitude;

                    // Center map on device location
                    CenterMapOnDevice(latitude, longitude);
                }
                else
                {
                    MessageBox.Show("Location is unknown.");
                }
            };

            watcher.Start();
        }

        private void Map_Load(object sender, EventArgs e)
        {
            GetDeviceLocation();
        }
    }
}
