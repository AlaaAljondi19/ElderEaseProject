using ElderEaseProject.Models;
using System.ComponentModel.DataAnnotations;

namespace ElderEase_Project.Models
{
    public class HelpRequest
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        [Required]
        public string ProblemType { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}