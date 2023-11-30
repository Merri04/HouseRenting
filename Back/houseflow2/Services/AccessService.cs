using houseflow2.Interfaces;
using houseflow2.Models;
using MongoDB.Bson;

namespace houseflow2.Services
{
    public class AccessService : IAccessService
    {
        private readonly IHttpContextService _httpContextService;
        private readonly IAuthenticationService authenticationService;
        public Users User { get; set; } = new Users();

        public AccessService(IHttpContextService httpContextService, IAuthenticationService authenticationService)
        {
            _httpContextService = httpContextService;
            this.authenticationService = authenticationService;
        }

      

        public async Task<Users?> GetUserAsync(bool allowNull = false)
        {
            if (!ObjectId.TryParse(_httpContextService.UserName, out ObjectId userId) || userId == ObjectId.Empty)
            {
                if (allowNull)
                    return null;
                else
                     throw new Exception("user-not-found");
            }

            var user = await authenticationService.GetCurrentUserByUserId(userId);
            if (user is null && !allowNull)
            {
                throw new Exception("user-not-found");
            }

            return user;
        }

    }
}
