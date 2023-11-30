using houseflow2.Models;
using MongoDB.Bson;

namespace houseflow2.Interfaces
{
    public interface IRentedHauseService
    {
        Task<List<RentedHauses>> GetRentedHauses(ObjectId userId);
        Task<bool> DeleteRentedHause(ObjectId id);
        Task<RentedHauses?> SaveChanges(RentedHauses hause);
        Task<RentedHauses> GetRentedHause(ObjectId Id);
        Task<RentedHauses> GetRentedHauseByHauseIdAndUserId(ObjectId hauseId, ObjectId userId);
    }
}
