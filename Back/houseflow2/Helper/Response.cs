using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Helper
{
    public class Response<T> where T : class
    {
        public T? Result { get; }
        public bool IsSuccess { get; }
        public string? ErrorMessage { get; } 
        public string? ErrorCode { get; }

        private Response(T result, bool hasError, string errorMessage)
        {
            this.Result = result;
            this.IsSuccess = hasError;
            this.ErrorMessage = errorMessage;
        }

        private Response(bool hasError, string errorMessage, string errorCode)
        {
            this.IsSuccess = hasError;
            this.ErrorMessage = errorMessage;
            this.ErrorCode = errorCode;
        }

        public static Response<T> Success(T result)
        {
            return new Response<T>(result, true, string.Empty);
        }

        public static Response<T> Error(string errorMessage, string errorCode = "500")
        {
            return new Response<T>(false, errorMessage, errorCode);
        }

        public static Response<T> Error401(string errorMessage)
        {
            return new Response<T>(false, errorMessage, "401");
        }
    }

    public class Response
    {
        public bool IsSuccess { get; set; }
        public string? ErrorMessage { get; set; }
        public string? ErrorCode { get; set; }
        public object? Result { get; set; } 


        public Response()
        {
            IsSuccess = true;
            Result = null;
        }

        public Response(ModelStateDictionary modelState)
        {
            var errors = new List<string>();
            foreach (var model in modelState)
            {
                errors.AddRange(model.Value.Errors.Select(x => x.ErrorMessage));
            }
            IsSuccess = false;
            ErrorMessage = string.Join("\r\n", errors);
            ErrorCode = "405";
        }

        public Response(Exception ex)
        {
            IsSuccess = false;
            ErrorMessage = ex.Message;
        }

        public Response(object result)
        {
            IsSuccess = true;
            ErrorMessage = null;
            ErrorCode = null;
            Result = result;
        }

        public Response(string errorMessage, string errorCode = "")
        {
            IsSuccess = false;
            ErrorMessage = errorMessage;
            ErrorCode = errorCode;
        }

        public static Response Error(string errorMessage, string errorCode = "500")
        {
            return new Response(errorMessage, errorCode);
        }
    }
}
