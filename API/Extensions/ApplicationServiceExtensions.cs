using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
	public static class ApplicationServiceExtensions
	{
		public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
		{
            services.AddScoped<ITokenService, TokenService>();
			services.AddScoped<LogUserActivity>();
			services.AddScoped<IUserRepository, UserRepository>();
			services.AddScoped<ILikesRepository, LikesRepository>();
			services.AddScoped<IMessageRepository, MessageRepository>();
			services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
			services.AddDbContext<DataContext>(options =>
			{
				options.UseSqlite(config.GetConnectionString("DefaultConnection"));
			});

            return services;
		}
	}
}