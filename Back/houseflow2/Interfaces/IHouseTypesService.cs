using houseflow2.Models;
using MongoDB.Bson;

namespace houseflow2.Interfaces
{
    public interface IHouseTypesService
    {
        List<HouseTypes> GetAll();
        void SeedHouseTypes();
        HouseTypes GetById(ObjectId Id);
    }
}
