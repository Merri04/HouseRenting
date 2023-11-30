using Helper;
using Microsoft.AspNetCore.Diagnostics;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Net;

namespace houseflow2.ErrorHandling
{
    public static class HandleErrors
    {
        public static async Task Exec(HttpContext context)
        {
            var exceptionFeature = context.Features.Get<IExceptionHandlerFeature>();
            var errorMessage = exceptionFeature?.Error.Message;

            context.Response.ContentType = "application/json";
            var statusCode = context.Response.StatusCode;
            var resp = Response.Error(errorMessage ?? TranslateErorMessage(statusCode), statusCode.ToString());

            context.Response.StatusCode = (int)HttpStatusCode.OK;

            var Content = JsonConvert.SerializeObject(resp, new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() });
            await context.Response.WriteAsync(Content);
        }

        private static string TranslateErorMessage(int statusCode)
        {
            return statusCode switch
            {
                400 => "bad-request-error-message",
                401 => "unauthorized-error-message",
                403 => "forbidden-error-message",
                404 => "not-found-error-message",
                500 => "internal-server-error-message",
                _ => "unknown-error-message",
            };
        }
    }
}
