using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	public class AdminController : BaseApiController
	{
		private readonly UserManager<AppUser> _userManager;
		private readonly IUnitOfWork _unitOfWork;
		private readonly IMapper _mapper;

		public AdminController(UserManager<AppUser> userManager, IUnitOfWork unitOfWork, IMapper mapper)
		{
			_mapper = mapper;
			_unitOfWork = unitOfWork;
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

		[Authorize(Policy = "RequireCaptainRole")]
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
		[HttpGet("users-photos-to-moderate")]
		public async Task<ActionResult> GetPhotosForModeration([FromQuery] PaginationParams paginationParams)
		{
			var users = await _unitOfWork.PhotoRepository.GetUsersWithPendingPhotos(paginationParams);
			Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
			return Ok(users);
		}

		[Authorize(Policy = "FirstMatePhotoRole")]
		[HttpPatch]
		public async Task<ActionResult> ApprovePhoto(UserPhotoApproval userPhotoApproval)
		{
			var user = await _unitOfWork.PhotoRepository.GetUser(userPhotoApproval.UserId);

			if (user == null) return NotFound("User not found");

			var photo = user.Photos.FirstOrDefault(x => x.Id == userPhotoApproval.PhotoId);

			if (photo == null) return NotFound("Photo not found");

			if (photo.IsApproved) return BadRequest("Photo already approved");

			photo.IsApproved = true;

			if (photo.IsMain)
			{
				foreach (var userPhoto in user.Photos.Where(x => x.IsMain && x.Id != photo.Id))
				{
					userPhoto.IsMain = false;
				}
			}
			else if (!user.Photos.Any(x => x.IsMain && x.IsApproved))
			{
				photo.IsMain = true;
			}

			_unitOfWork.UserRepository.Update(user);

			if (await _unitOfWork.Complete()) return Ok(_mapper.Map<UserWithPendingPhotosDto>(user));

			return BadRequest("Failed to save");
		}

		[Authorize(Policy = "FirstMatePhotoRole")]
		[HttpDelete("{id}")]
		public async Task<ActionResult> DenyPhoto(int id)
		{
			var photo = await _unitOfWork.PhotoRepository.GetPhoto(id);

			if (photo == null) return BadRequest("Photo already deleted");

			if (photo.IsApproved) return BadRequest("This photo has already been approved");

			_unitOfWork.PhotoRepository.RemovePhoto(photo);

			if (await _unitOfWork.Complete()) return Ok();

			return BadRequest("Failed to save");
		}
	}
}
