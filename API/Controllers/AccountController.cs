using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	public class AccountController : BaseApiController
	{
		private readonly DataContext _context;
		private readonly ITokenService _tokenService;
		private readonly IMapper _mapper;
		public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
		{
			_mapper = mapper;
			_tokenService = tokenService;
			_context = context;
		}

		[HttpPost("register")]
		public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
		{
			if (await UserExists(registerDto.Username)) return BadRequest("It seems someone got your username a few seconds ago, what a bad luck");

			using var hmac = new HMACSHA512();

			var user = _mapper.Map<AppUser>(registerDto);

			user.UserName = registerDto.Username.ToLower();
			user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
			user.PasswordSalt = hmac.Key;

			// _mapper.Map(registerDto, user);

			if (!user.Photos.Any(x => x.IsMain)) user.Photos.FirstOrDefault().IsMain = true;

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			return new UserDto
			{
				Username = user.UserName,
				Token = _tokenService.CreateToken(user),
				PhotoUrl = user.Photos.First(x => x.IsMain)?.Url,
				knownAs = user.KnownAs
			};
		}

		[HttpPost("login")]
		public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
		{
			var user = await _context.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

			if (user == null) return Unauthorized("Invalid username or password");

			using var hmac = new HMACSHA512(user.PasswordSalt);
			var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

			if (!user.PasswordHash.SequenceEqual(computedHash)) return Unauthorized("Invalid username or password");

			return new UserDto
			{
				Username = user.UserName,
				Token = _tokenService.CreateToken(user),
				PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
				knownAs = user.KnownAs
			};
		}

		[HttpGet("user-exists/{username}")]
		public async Task<ActionResult<bool>> TaskUserExists(string username)
		{
			return Ok(await UserExists(username));
		}

		private async Task<bool> UserExists(string username)
		{
			return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
		}
	}
}