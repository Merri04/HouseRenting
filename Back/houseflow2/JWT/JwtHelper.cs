using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace houseflow2
{
    public static class JwtHelper
    {
        public static string GenerateJwtToken(JwtConfig jwtConfig, ObjectId userId,DateTime now)
        {
            var claims = GetClaimsForUser(userId);

            var securityKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.SecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtConfig.Issuer,
                audience: jwtConfig.Audience,
                claims: claims,
                expires: now.AddMinutes(jwtConfig.ExpireMinutes),//now.AddSeconds(5),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static IEnumerable<Claim> GetClaimsForUser(ObjectId userId)
        {
            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.Name,userId.ToString()) // Claim for username
            };

            // Add more claims as needed

            return claims;
        }
    }
}
