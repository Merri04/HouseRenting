using houseflow2.Models;
using MongoDB.Bson;

namespace houseflow2.Interfaces
{
    public interface IHouseService
    {
        Task<List<Houses>> GetAllHousesAsync();
        Task<List<Houses>> GetUserHousesAsync(ObjectId ownerId);
        Task<Houses> GetHouseAsync(ObjectId id);
        Task<bool> DeleteHouseAsync(Houses house);
        Task<Houses?> SaveChangesAsync(Houses house);
        Task<List<HouseImagesViewModel>> GetAllHousesWithImages();
        Task<List<HouseImagesViewModel>> GetAllHousesWithImages(string fromDate, string toDate, string typeId);
        Task<HouseDetailViewModel> GetHouseByImagesAsync(ObjectId objectId);
        void SeedData();
    }
}
