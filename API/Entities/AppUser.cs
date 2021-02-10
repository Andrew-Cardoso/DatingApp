using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using API.Extensions;
using API.Validations;

namespace API.Entities
{
	public class AppUser
	{
		public int Id { get; set; }
		public string UserName { get; set; }
		public byte[] PasswordHash { get; set; }
		public byte[] PasswordSalt { get; set; }
		[AgeRange]
		public DateTime DateOfBirth { get; set; }
		public string KnownAs { get; set; }
		public DateTime Created { get; set; } = DateTime.Now;
		public DateTime LastActive { get; set; } = DateTime.Now;

		[StringLength(1)]
		public string Gender { get; set; }
		public string Introduction { get; set; }
		public string LookingFor { get; set; }
		public string Interests { get; set; }
		public string City { get; set; }
		public string Country { get; set; }
		public ICollection<Photo> Photos { get; set; }

		// Reduces performance when querying to database using automapper queryable to map
		// public int GetAge()
		// {
        //     return DateOfBirth.CalculateAge();
		// }

	}
}