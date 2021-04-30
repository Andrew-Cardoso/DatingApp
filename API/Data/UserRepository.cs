using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
	public class UserRepository : IUserRepository
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;
		public UserRepository(DataContext context, IMapper mapper)
		{
			_mapper = mapper;
			_context = context;
		}

		public async Task<MemberDto> GetMemberAsync(string username)
		{
			// Older and less performatic way - the query gets all columns, then map them;
			// return await _context.Users.Where(x => x.UserName == username.ToLower())
			// .Select(user => new MemberDto 
			// {
			//  Id = user.id, 
			// 	Username = user.UserName, 
			// 	...
			// }).SingleOrDefaultAsync();

			//Newer and faster way - The query gets only the columns needed.
			return await _context.Users
			.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
			.SingleOrDefaultAsync(x => x.Username == username.ToLower());
		}

		public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
		{
			/* Without pagination */
			// return await _context.Users
			// .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
			// .ToListAsync();

			var minDateOfBirth = DateTime.Today.AddYears(-userParams.MaxAge - 1);
			var maxDateOfBirth = DateTime.Today.AddYears(-userParams.MinAge);

			var query = _context.Users
			.AsQueryable()
			.Where(user => user.UserName != userParams.CurrentUsername && user.Gender == userParams.Gender)
			.Where(user => user.DateOfBirth >= minDateOfBirth && user.DateOfBirth <= maxDateOfBirth)
			.OrderByDescending(user => userParams.OrderBy == "created" ? user.Created : user.LastActive)
			.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
			.AsNoTracking();

			return await PagedList<MemberDto>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
		}

		public async Task<AppUser> GetUserAsync(int id)
		{
			return await _context.Users.FindAsync(id);
		}

		public async Task<AppUser> GetUserAsync(string username)
		{
			return await _context.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.UserName == username.ToLower());
		}

		public async Task<IEnumerable<AppUser>> GetUsersAsync()
		{
			return await _context.Users.Include(x => x.Photos).ToListAsync();
		}
		public async Task<string> GetUserGender(string username)
		{
			return await _context.Users.Where(x => x.UserName == username).Select(x => x.Gender).FirstOrDefaultAsync();
		}
		public void Update(AppUser user)
		{
			_context.Entry(user).State = EntityState.Modified;
		}
	}
}