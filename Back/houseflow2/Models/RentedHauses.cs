using MongoDB.Bson;

namespace houseflow2.Models
{
    public class RentedHauses
    {
        public ObjectId Id { get; set; }
        public ObjectId HauseId { get; set; }
        public ObjectId UserId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int Numbers { get; set; }
        public DateTime RequestDate { get; set; } = DateTime.Now;
    }
}
