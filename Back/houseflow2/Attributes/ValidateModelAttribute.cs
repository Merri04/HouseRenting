using Helper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace houseflow2.Attributes
{
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            if (!actionContext.ModelState.IsValid)
            {
                var resp = new Response(actionContext.ModelState);
                actionContext.Result = new JsonResult(resp);
                base.OnActionExecuting(actionContext);
            }
        }
    }
}
