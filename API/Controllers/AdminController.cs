using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;

        public AdminController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [Authorize(Policy = "RequireCaptainRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUserWithRoles()
        {
			var users =
				await _userManager
					.Users
					.Include(x => x.UserRoles)
					.ThenInclude(x => x.Role)
					.OrderBy(x => x.UserName)
					.Select(x => new 
                    {
                        x.Id,
                        Username = x.UserName,
                        Roles = x.UserRoles.Select(y => y.Role.Name).ToList()
                    })
                    .ToListAsync();

            return Ok(users);
        }

        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
			var selectedRoles = roles.Split(",").ToArray();

			var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find user");

			var userRoles = await _userManager.GetRolesAsync(user);

			var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded) return BadRequest("Failed to add roles");

			result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded) return BadRequest("Failed to remove roles");

			return Ok(await _userManager.GetRolesAsync(user));
		}

        [Authorize(Policy = "FirstMatePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPhotosForModeration()
        {
            return Ok("Admins or moderators can see this");
        }
    }
}
