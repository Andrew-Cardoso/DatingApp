using System.Collections.Generic;

namespace API.DTOs
{
    public class UserWithPendingPhotosDto
    {
		public int Id { get; set; }
		public string PhotoUrl { get; set; }
		public string KnownAs { get; set; }
		public ICollection<PhotoDto> Photos { get; set; }
    }
}