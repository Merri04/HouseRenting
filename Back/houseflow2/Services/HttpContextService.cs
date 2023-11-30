using houseflow2.Interfaces;

namespace houseflow2.Services
{
    public class HttpContextService : IHttpContextService
    {
        private readonly IHttpContextAccessor contextAccessor;
        private HttpContext HttpContext => contextAccessor is null || contextAccessor.HttpContext is null
                    ? throw new Exception("HttpContext is null")
                    : contextAccessor.HttpContext;

        public string UserName => HttpContext is not null && HttpContext.User is not null && HttpContext.User.Identity is not null
                    ? HttpContext.User.Identity.Name ?? ""
                    : "";

        public HttpContextService(IHttpContextAccessor contextAccessor)
        {
            this.contextAccessor = contextAccessor;
        }

        public string? GetHeader(string name)
        {
            _ = HttpContext.Request.Headers.TryGetValue(name, out Microsoft.Extensions.Primitives.StringValues value);
            return !string.IsNullOrEmpty(value) ? value : "";
        }

        public void SetCookie(string name, string value)
        {
            HttpContext.Response.Cookies.Append(name, value, GetCookieOption());
        }

        public string? GetCookie(string name)
        {
            _ = HttpContext.Request.Cookies.TryGetValue(name, out string? value);
            return value;
        }



        public string? GetQuery()
        {
            return HttpContext.Request.QueryString.Value;
        }

        public static CookieOptions GetCookieOption()
        {
            return new CookieOptions() { HttpOnly = false };
            //return new CookieOptions() { HttpOnly = true, SameSite = SameSiteMode.Unspecified };
        }
    }
}
