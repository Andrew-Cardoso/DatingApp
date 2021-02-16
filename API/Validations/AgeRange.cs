using System;
using System.ComponentModel.DataAnnotations;

namespace API.Validations
{
	public class AgeRange : ValidationAttribute
	{
		public AgeRange() { }
		protected override ValidationResult IsValid(object value, ValidationContext validationContext)
		{
			var minDateRange = DateTime.Now.AddYears(-120);
			var maxDateRange = DateTime.Now.AddYears(-18);

			if ((DateTime)value <= maxDateRange && (DateTime)value > minDateRange) return ValidationResult.Success;
            return new ValidationResult("You must be at least 18 to register");
		}

	}
}