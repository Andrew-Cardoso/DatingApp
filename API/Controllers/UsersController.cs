using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{
	// [Authorize]
	[Authorize]
	public class UsersController : BaseApiController
	{
		private readonly IUserRepository _userRepository;
		private readonly IMapper _mapper;
		public UsersController(IUserRepository userRepository, IMapper mapper)
		{
			_mapper = mapper;
			_userRepository = userRepository;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
		{
			//return Ok(_mapper.Map<IEnumerable<MemberDto>>(await _userRepository.GetUsersAsync()));
			return Ok(await _userRepository.GetMembersAsync());
		}

		[HttpGet("{username}")]
		public async Task<ActionResult<MemberDto>> GetUser(string username)
		{
			return await _userRepository.GetMemberAsync(username);
		}

		[HttpPut]
		public async Task<ActionResult<MemberDto>> UpdateUser(MemberUpdateDto memberUpdated)
		{
			var username = User.GetUsername();
			var user = await _userRepository.GetUserAsync(username);

			_mapper.Map(memberUpdated, user);
			_userRepository.Update(user);
			
			if (!user.Photos.Any(x => x.IsMain)) user.Photos.FirstOrDefault().IsMain = true;

			if (await _userRepository.SaveAllAsync()) return Ok(_mapper.Map<MemberDto>(user));
			return BadRequest($"Failed to update {username}");
		}

		// [HttpPatch]
		// public async Task<ActionResult> UpdatePhotos(IEnumerable<PhotoDto> photos)
		// {
		// 	var currentUser = await _userRepository.GetUserAsync(User.GetUsername());
		// 	_mapper.Map<IEnumerable<PhotoDto>, IEnumerable<Photo>>(photos, currentUser.Photos);
		// 	_userRepository.Update(currentUser);
			
		// 	if (await _userRepository.SaveAllAsync()) return NoContent();
		// 	return BadRequest("Something wrong happened");
		// }

	}
}