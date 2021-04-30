using System;
using System.Threading.Tasks;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace API.Helpers
{
	public class LogUserActivity : IAsyncActionFilter
	{
		public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
		{
			var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

			int userId = resultContext.HttpContext.User.GetUserId();
			IUserRepository repo = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
			AppUser user = await repo.GetUserAsync(userId);
			user.LastActive = DateTime.UtcNow;

			await repo.SaveAllAsync();
		}
	}
}