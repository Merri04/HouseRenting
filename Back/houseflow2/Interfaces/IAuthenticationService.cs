using houseflow2.Models;
using MongoDB.Bson;

namespace houseflow2.Interfaces
{
    public interface IAuthenticationService
    {
        Task<Users> GetCurrentUserByUserId(ObjectId? username);
        Task<LoginResult?> Login(string email, string password);
        Task<bool> Register(string email, string password, string firstName, string lastName);
        void SeedData();
    }
}
