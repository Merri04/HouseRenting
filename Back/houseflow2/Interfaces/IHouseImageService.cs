using houseflow2.Models;
using MongoDB.Bson;

namespace houseflow2.Interfaces
{
    public interface IHouseImageService
    {
        Task<bool> AddImageAsync(HouseImages image);
        Task<bool> DeleteImageAsync(ObjectId id);
        Task<HouseImages> GetHouseImageAsync(ObjectId id);
        Task<List<HouseImages>> GetImagesByHouseIdAsync(ObjectId houseId);
        void SeedData();
    }
}
