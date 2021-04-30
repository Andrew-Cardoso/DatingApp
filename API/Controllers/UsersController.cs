using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace API.Controllers
{
	[Authorize]
	public class UsersController : BaseApiController
	{
		private readonly IMapper _mapper;
		private readonly IUnitOfWork _unitOfWork;
		public UsersController(IMapper mapper, IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_mapper = mapper;
		}

		[HttpGet]
		public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
		{
			
			userParams.CurrentUsername = User.GetUsername();
			var gender = await _unitOfWork.UserRepository.GetUserGender(userParams.CurrentUsername);

			if (string.IsNullOrEmpty(userParams.Gender)) userParams.Gender = gender == "m" ? "f" : "m";

			var users = await _unitOfWork.UserRepository.GetMembersAsync(userParams);
			Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

			return Ok(users);
		}

		[HttpGet("{username}")]
		public async Task<ActionResult<MemberDto>> GetUser(string username)
		{
			return await _unitOfWork.UserRepository.GetMemberAsync(username);
		}

		[HttpPut]
		public async Task<ActionResult<MemberDto>> UpdateUser(MemberUpdateDto memberUpdated)
		{
			var username = User.GetUsername();
			var user = await _unitOfWork.UserRepository.GetUserAsync(username);

			_mapper.Map(memberUpdated, user);
			_unitOfWork.UserRepository.Update(user);

			if (!user.Photos.Any(x => x.IsMain)) user.Photos.FirstOrDefault().IsMain = true;

			if (await _unitOfWork.Complete()) return Ok(_mapper.Map<MemberDto>(user));
			return BadRequest($"Failed to update {username}");
		}

	}
}