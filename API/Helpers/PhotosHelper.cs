using System.Collections.Generic;
using System.Linq;
using API.Entities;

namespace API.Helpers
{
    public static class PhotosHelper
    {
        public static string GetMainPhoto(ICollection<Photo> photos)
        {
            if (photos == null || photos.Count() == 0 || !photos.Any(x => x.IsApproved) || !photos.Any(x => x.IsMain) || photos.FirstOrDefault(x => x.IsMain && x.IsApproved) == null) return "assets/photos/default.png";
            return photos.FirstOrDefault(x => x.IsMain).Url;
        }
    }
}