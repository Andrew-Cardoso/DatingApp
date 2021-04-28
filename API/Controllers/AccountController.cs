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
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
	public class AccountController : BaseApiController
	{
		private readonly ITokenService _tokenService;
		private readonly IMapper _mapper;
		private readonly UserManager<AppUser> _userManager;
		private readonly SignInManager<AppUser> _signInManager;
		public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
		{
			_signInManager = signInManager;
			_userManager = userManager;
			_mapper = mapper;
			_tokenService = tokenService;
		}

		[HttpPost("register")]
		public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
		{
			if (await UserExists(registerDto.Username)) return BadRequest("It seems someone got your username a few seconds ago, what a bad luck");

			// using var hmac = new HMACSHA512();

			var user = _mapper.Map<AppUser>(registerDto);

			user.UserName = registerDto.Username.ToLower();
			// user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password));
			// user.PasswordSalt = hmac.Key;

			// _mapper.Map(registerDto, user);

			if (!user.Photos.Any(x => x.IsMain)) user.Photos.FirstOrDefault().IsMain = true;


			var result = await _userManager.CreateAsync(user, registerDto.Password);

			if (!result.Succeeded) return BadRequest(result.Errors);

			var roleResult = await _userManager.AddToRoleAsync(user, "StrawHatPirate");

			if (!roleResult.Succeeded) return BadRequest(result.Errors);

			return new UserDto
			{
				Username = user.UserName,
				Token = await _tokenService.CreateToken(user),
				PhotoUrl = user.Photos.First(x => x.IsMain)?.Url,
				knownAs = user.KnownAs,
				Gender = user.Gender
			};
		}

		[HttpPost("login")]
		public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
		{
			var user = await _userManager.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.UserName == loginDto.Username.ToLower());

			if (user == null) return Unauthorized("Invalid username");

			// using var hmac = new HMACSHA512(user.PasswordSalt);
			// var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

			// if (!user.PasswordHash.SequenceEqual(computedHash)) return Unauthorized("Invalid username or password");

			var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

			if (!result.Succeeded) return Unauthorized();

			return new UserDto
			{
				Username = user.UserName,
				Token = await _tokenService.CreateToken(user),
				PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
				knownAs = user.KnownAs,
				Gender = user.Gender
			};
		}

		[HttpGet("user-exists/{username}")]
		public async Task<ActionResult<bool>> TaskUserExists(string username)
		{
			return Ok(await UserExists(username));
		}

		private async Task<bool> UserExists(string username)
		{
			return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
		}
	}
}