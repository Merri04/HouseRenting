using houseflow2.DAL;
using houseflow2.Interfaces;
using houseflow2.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace houseflow2.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IMongoCollection<Users> _userCollection;
        private readonly JwtConfig jwtConfig;
        private readonly MongoDBContext db;
        private IMongoDBContext object1;
        private IOptions<JwtConfig> object2;

        public AuthenticationService(MongoDBContext db, IOptions<JwtConfig> jwtConfig)
        {
            this.jwtConfig = jwtConfig.Value;
            this.db = db;
            _userCollection = this.db.GetCollection<Users>("user");
        }

        public AuthenticationService(IMongoDBContext object1, IOptions<JwtConfig> object2)
        {
            this.object1 = object1;
            this.object2 = object2;
        }

        public void SeedData()
        {
            var Users = _userCollection.Find(_ => true);
            if (Users.Any()) return;

            var user = new Users
            {
                Id = ObjectId.Parse("651464f29e9afbfdf56a555d"),
                Email = "test@gmail.com",
                Password = "123456",
                FirstName = "narges",
                LastName = "rezaei"
            };

            _userCollection.InsertOne(user);
        }

        public async Task<bool> Register(string email, string password, string firstName, string lastName)
        {
            // Check if the user with the given email already exists
            var user = await _userCollection.FindAsync(u => u.Email == email);
            if (await user.AnyAsync())
            {
                throw new Exception("User with the same email already exists.");
            }

            Users newUser = new()
            {
                Email = email,
                Password = password,
                FirstName = firstName,
                LastName = lastName
            };

            _userCollection.InsertOne(newUser);
            return true;    
        }

        public async Task<LoginResult?> Login(string email, string password)
        {
            // Find the user with the given email
            var user = await _userCollection.FindAsync(u => u.Email == email);

            var _user = await user.FirstOrDefaultAsync();
            if (_user is null) throw new Exception("username-or-password-is-incorrect");

            if (user == null || _user.Password != password)
            {
                return null;
            }


            var token = JwtHelper.GenerateJwtToken(this.jwtConfig, _user.Id, DateTime.Now);
            var result = new LoginResult
            {
                Token = token,
                UserName = _user.Email,
                DisplayName = $"{_user.FirstName} {_user.LastName}",
            };
            return result;
        }
        public async Task<Users> GetCurrentUserByUserId(ObjectId? userId)
        {
            // Find the user with the given username
            var user = await _userCollection.FindAsync(u => u.Id == userId);

            if (user == null)
            {
                throw new Exception("User not found.");
            }

            return await user.FirstOrDefaultAsync();
        }
    }
}
