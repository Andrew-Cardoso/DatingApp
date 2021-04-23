using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using API.Entities;
using API.Validations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; }
        
        [Required]
        [StringLength(8, MinimumLength = 4)]
        public string Password { get; set; }

		[AgeRange]
		public DateTime DateOfBirth { get; set; }
        
        [Required]
		public string KnownAs { get; set; }

        [Required]
		[StringLength(1)]
		public string Gender { get; set; }
		public string Introduction { get; set; }
		public string LookingFor { get; set; }
		public string Interests { get; set; }
        [Required]
		public string City { get; set; }
        [Required]
		public string Country { get; set; }
        [Required(ErrorMessage = "You need at least one photo.")]
		public ICollection<Photo> Photos { get; set; }

    }
}