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
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;

        private readonly IMapper _mapper;

        public PhotoRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

		public async Task<Photo> GetPhoto(int id)
		{
			return await _context.Photos.IgnoreQueryFilters().FirstOrDefaultAsync(x => x.Id == id);
		}
        public async Task<AppUser> GetUser(int id)
        {
			return await _context.Users.IgnoreQueryFilters().Include(x => x.Photos).FirstOrDefaultAsync(x => x.Id == id);
		}

		public async Task<PagedList<UserWithPendingPhotosDto>> GetUsersWithPendingPhotos(PaginationParams paginationParams)
        {
            var query =
                _context
                    .Users
                    .IgnoreQueryFilters()
                    .OrderBy(x => x.LastActive)
                    .ProjectTo<UserWithPendingPhotosDto>(_mapper.ConfigurationProvider)
					.Where(x => x.Photos.Any(p => !p.IsApproved))
                    .AsNoTracking();

            return await PagedList<UserWithPendingPhotosDto>.CreateAsync(query,paginationParams.PageNumber, paginationParams.PageSize);
        }

        public void RemovePhoto(Photo photo)
        {
            _context.Photos.Remove(photo);
        }

        public void RemovePhotos(ICollection<Photo> photos)
        {
            _context.Photos.RemoveRange(photos);
        }

		public void Update(Photo photo)
		{
			_context.Entry(photo).State = EntityState.Modified;
		}
	}
}
