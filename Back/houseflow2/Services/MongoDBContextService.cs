using houseflow2.Interfaces;
using houseflow2.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace houseflow2.Services
{
    public class MongoDBContextService : IMongoDBContext 
    {
        private readonly IMongoDatabase _database;

        public MongoDBContextService(string connectionString, string databaseName)
        {
            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }

        public IConfiguration Database => throw new NotImplementedException();

        public IMongoCollection<T> GetCollection<T>(string name)
        {
            throw new NotImplementedException();
        }
    }
}
