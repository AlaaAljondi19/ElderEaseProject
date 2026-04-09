using System.ComponentModel.DataAnnotations;

namespace ElderEaseProject.Models
{
    public class Organization
    {

        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "اسم المؤسسة مطلوب")]
        public string OrgName { get; set; } = string.Empty;

        [Required]
        public string ActivityType { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public string City { get; set; } = string.Empty;

        public string? FullAddress { get; set; }

        public string? ContactEmail { get; set; }

        public string? LicenseNumber { get; set; }

    }
}
