using houseflow2.Models;

namespace houseflow2
{
    public class HousesEditDTO
    {
        public Houses Data { get; set; } = new Houses();
        public List<HouseTypes> Types { get; set; } = new List<HouseTypes> { };
    }
}
