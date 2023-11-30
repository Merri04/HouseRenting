using MongoDB.Driver;

namespace houseflow2.Interfaces
{
    public interface IMongoDBContext
    {
        IConfiguration Database { get; }

        IMongoCollection<T> GetCollection<T>(string name);
    }
}
