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
			var unitOfWork = resultContext.HttpContext.RequestServices.GetService<IUnitOfWork>();
			AppUser user = await unitOfWork.UserRepository.GetUserAsync(userId);
			user.LastActive = DateTime.UtcNow;

			await unitOfWork.Complete();
		}
	}
}