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
                opt =>
                    opt.MapFrom(src => PhotosHelper.GetMainPhoto(src.Photos)))
                .ForMember(dest => dest.Age,
                opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap<Photo, PhotoDto>().ReverseMap();

            CreateMap<MemberUpdateDto, AppUser>();

            CreateMap<RegisterDto, AppUser>();

            CreateMap<Message, MessageDto>()
                .ForMember(dest => dest.SenderPhotoUrl,
                opt =>
                    opt
                        .MapFrom(src =>
                            PhotosHelper.GetMainPhoto(src.Sender.Photos)))
                .ForMember(dest => dest.ReceiverPhotoUrl,
                opt =>
                    opt
                        .MapFrom(src =>
                            PhotosHelper.GetMainPhoto(src.Receiver.Photos)))
                .ForMember(dest => dest.SenderGender,
                opt => opt.MapFrom(src => src.Sender.Gender))
                .ForMember(dest => dest.ReceiverGender,
                opt => opt.MapFrom(src => src.Receiver.Gender));

			CreateMap<AppUser, UserWithPendingPhotosDto>()
			.ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => PhotosHelper.GetMainPhoto(src.Photos)))
			.ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.Photos.Where(x => !x.IsApproved)));

			// Using a almost database level convertion in Data/DataContext
			// CreateMap<DateTime, DateTime>().ConvertUsing(dest => DateTime.SpecifyKind(dest, DateTimeKind.Utc));
		}
    }
}
