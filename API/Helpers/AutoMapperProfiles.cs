using System;
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

			CreateMap<Photo, PhotoDto>().ReverseMap();

			CreateMap<MemberUpdateDto, AppUser>();

			CreateMap<RegisterDto, AppUser>();

			CreateMap<Message, MessageDto>()
			.ForMember(dest => dest.SenderPhotoUrl, opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
			.ForMember(dest => dest.ReceiverPhotoUrl, opt => opt.MapFrom(src => src.Receiver.Photos.FirstOrDefault(x => x.IsMain).Url))
			.ForMember(dest => dest.SenderGender, opt => opt.MapFrom(src => src.Sender.Gender))
			.ForMember(dest => dest.ReceiverGender, opt => opt.MapFrom(src => src.Receiver.Gender));

			CreateMap<DateTime, DateTime>().ConvertUsing(dest => DateTime.SpecifyKind(dest, DateTimeKind.Utc));
		}
	}
}