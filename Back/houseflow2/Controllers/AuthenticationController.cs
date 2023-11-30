using Helper;
using houseflow2.Attributes;
using houseflow2.Helper;
using houseflow2.Interfaces;
using houseflow2.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using IAuthenticationService = houseflow2.Interfaces.IAuthenticationService;

namespace houseflow2.Controllers
{
    [EnableCors("HouseFlow")]
    [ApiController]
    [ValidateModel]
    public class AuthenticationController
    {
        private readonly IAuthenticationService _authenticationService;
        private readonly IAccessService accessService;

        public AuthenticationController(IAuthenticationService authenticationService, IAccessService accessService)
        {
            _authenticationService = authenticationService;
            this.accessService = accessService;
        }

        [HttpPost]
        [Route("~/authentication/register")]
        public async Task<Response> Register(RegisterViewModel model)
        {
            if (!Validation.IsValidEmail(model.Email))
            {
                return new Response( "Enter a valid Email!");
            }
           
            try
            {
                var Registered = await _authenticationService.Register(model.Email, model.Password, model.FirstName, model.LastName);
                return new Response(new { Registered,Message = "register-success" });
            }
            catch (Exception ex)
            {
                return new Response("Registration failed: " + ex.Message);
            }

        }

        [HttpPost]
        [Route("~/authentication/login")]
        public async Task<Response> Login(LoginViewModel model)
        {
          if (!Validation.IsValidEmail(model.Email))
            {
                return new Response("Enter a valid Email!");
            }


            try
            {
                var result = await _authenticationService.Login(model.Email, model.Password);
                if (result is not null)
                {

                    return new Response(new {loggedIn = true, LoginData = new { result.UserName, result.DisplayName, result.Token } });
                }
                else
                {
                    return new Response("Invalid email or password");
                }
            }
            catch (Exception ex)
            {
                return new Response("Login failed: " + ex.Message);
            }

            
        }

        [Authorize]
        [HttpGet]
        [Route("~/authentication/user-info")]
        public async Task<Response> UserInfo()
        {
            var user = await accessService.GetUserAsync();
            if (user is null) return new Response("bad-request");

            var result = new {

                DisplayName = $"{user.FirstName} {user.LastName}",
                UserName = user.Email,
                UserId = user.Id.ToString()
            };

            return new Response(result);
        }

    }
}