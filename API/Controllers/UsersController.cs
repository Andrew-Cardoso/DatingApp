using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
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
	}
}