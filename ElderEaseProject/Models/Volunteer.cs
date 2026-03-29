using System.ComponentModel.DataAnnotations;

namespace ElderEaseProject.Models
{
    public class Volunteer
    {

        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "الاسم الكامل مطلوب")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "البريد الإلكتروني مطلوب")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; } // علامة ? تخفي الخط الأخضر

        public string? Specialization { get; set; }

        public int AvailableHoursPerWeek { get; set; }

        public string? ExperienceSummary { get; set; }

        public string? Address { get; set; }

        public DateTime RegistrationDate { get; set; } = DateTime.Now;

    }
}
