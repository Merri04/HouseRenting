using houseflow2.Models;

namespace houseflow2
{
    public class HouseImagesDTO
    {
        public List<HouseImages> Images { get; set; } = new List<HouseImages>();
        public string HouseId { get; set; } = "";
    }
}
