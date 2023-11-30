using houseflow2.Models;

namespace houseflow2
{
    public class HouseDetailViewModel
    {
        public HousesDTO House { get; set; } = new HousesDTO();
        public List<HouseImages> Images { get; set; } = new List<HouseImages> { };

        public RentedHausesDTO? RentedHauses { get; set; } 
    }
}
