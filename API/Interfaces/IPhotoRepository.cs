using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IPhotoRepository
    {
		void RemovePhoto(Photo photo);
		void RemovePhotos(ICollection<Photo> photos);
		void Update(Photo photo);
		Task<Photo> GetPhoto(int id);
		Task<AppUser> GetUser(int id);
		Task<PagedList<UserWithPendingPhotosDto>> GetUsersWithPendingPhotos(PaginationParams paginationParams);

	}
}