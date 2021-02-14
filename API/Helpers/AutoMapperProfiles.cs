using System.Linq;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
	public class AutoMapperProfiles : Profile
	{
		public AutoMapperProfiles()
		{
			// Mapping From / To

			CreateMap<AppUser, MemberDto>()
			.ForMember(destination => destination.PhotoUrl, 
			opt => opt.MapFrom(source => source.Photos.FirstOrDefault(x => x.IsMain).Url))
			.ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

			CreateMap<Photo, PhotoDto>();

			CreateMap<MemberUpdateDto, AppUser>();
		}
	}
}