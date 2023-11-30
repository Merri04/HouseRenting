using houseflow2.Models;

namespace houseflow2
{
    public class RentedHausesDTO
    {
        public string? Id { get; set; }
        public string? UserId { get; set; }
        public string HauseId { get; set; } = String.Empty;
        public HousesDTO? House { get; set; }
        public HouseImages? HouseImage { get; set; }
        public string FromDate { get; set; } = String.Empty;
        public string ToDate { get; set; } = String.Empty;
        public int Numbers { get; set; }
        public int TotalPrice { get; set; }
        public DateTime RequestDate { get; set; } = DateTime.Now;
    }
}
