using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ARKODesktop.Models
{
    public class Vessel
    {
        private int vessel_id;
        private string vessel_name;
        private string ip_address;
        private string network_name;
        private string date_created;
        private string time_created;
        private string token;
        public int Vessel_id { get => vessel_id; set => vessel_id = value; }
        public string Vessel_name { get => vessel_name; set => vessel_name = value; }
        public string Ip_address { get => ip_address; set => ip_address = value; }
        public string Network_name { get => network_name; set => network_name = value; }
        public string Date_created { get => date_created; set => date_created = value; }
        public string Time_created { get => time_created; set => time_created = value; }
        public string Token { get => token; set => token = value; }
    }
}
