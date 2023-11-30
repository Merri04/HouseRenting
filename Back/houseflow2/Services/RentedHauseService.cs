using houseflow2.DAL;
using houseflow2.Interfaces;
using houseflow2.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace houseflow2.Services
{
    public class RentedHauseService : IRentedHauseService
    {
        private readonly IMongoCollection<RentedHauses> _rentedHouseCollection;


        private readonly MongoDBContext _db;

        public RentedHauseService(MongoDBContext db)
        {
            _db = db;
            _rentedHouseCollection = _db.GetCollection<RentedHauses>("rentedHouses");
        }

        public async Task<RentedHauses?> SaveChanges(RentedHauses rentedHauses)
        {
            try
            {
                if (rentedHauses.Id == ObjectId.Empty)
                {//insert mode
                    await _rentedHouseCollection.InsertOneAsync(rentedHauses);
                }
                else
                {//update mode 
                    var filter = Builders<RentedHauses>.Filter.Eq("_id", rentedHauses.Id);
                    var update = Builders<RentedHauses>.Update
                        .Set("FromDate", rentedHauses.FromDate)
                        .Set("ToDate", rentedHauses.ToDate)
                        .Set("Numbers", rentedHauses.Numbers);

                    var result = await _rentedHouseCollection.UpdateOneAsync(filter, update);
                }
            }
            catch
            {
                return null;
            }
            return rentedHauses;
        }

        public async Task<bool> DeleteRentedHause(ObjectId id)
        {
            try
            {
                var filter = Builders<RentedHauses>.Filter.Eq("_id", id);
                var result = await _rentedHouseCollection.DeleteOneAsync(filter);
                return result.DeletedCount > 0;
            }
            catch
            {
                return false;
            }
        }

        public async Task<RentedHauses> GetRentedHause(ObjectId Id)
        {
            try
            {
                var filter = Builders<RentedHauses>.Filter.Eq("_id", Id);
                var house = await _rentedHouseCollection.Find(filter).FirstOrDefaultAsync();
                return house;
            }
            catch
            {
                throw new Exception("Id not found");
            }
        }

        public async Task<RentedHauses> GetRentedHauseByHauseIdAndUserId(ObjectId hauseId, ObjectId userId)
        {
            try
            {
                var filter = Builders<RentedHauses>.Filter.And(
                    Builders<RentedHauses>.Filter.Eq("HauseId", hauseId),
                    Builders<RentedHauses>.Filter.Eq("UserId", userId));

                var rentedHause = await _rentedHouseCollection.Find(filter).FirstOrDefaultAsync();
                return rentedHause;
            }
            catch
            {
                throw new Exception("Rented house not found");
            }
        }

        public async Task<List<RentedHauses>> GetRentedHauses(ObjectId userId)
        {
            try
            {
                var filter = Builders<RentedHauses>.Filter.Eq("UserId", userId);
                var houses = await _rentedHouseCollection.Find(filter).ToListAsync();
                return houses;
            }
            catch
            {
                throw new Exception("user Id not found");
            }
        }
    }
}
