using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ARKODesktop.Models
{
    public class UserInfoModel
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string HouseNo { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string Image { get; set; }
        public string ContactNo { get; set; }
        public string Gender { get; set; }
        public string BirthDate { get; set; } // YYYY-MM-DD format
    }
}
