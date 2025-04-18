using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ARKODesktop.Models
{
    public class StrandedRescue
    {
        public int StrandedId { get; set; }
        public int PinnedBy { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string Type { get; set; }
        public int? Number { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public DateTime? DateFinished { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
