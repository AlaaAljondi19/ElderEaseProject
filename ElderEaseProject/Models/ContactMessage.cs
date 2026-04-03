using System;
using System.ComponentModel.DataAnnotations;

namespace ElderEaseProject.Models
{
    public class ContactMessage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        public string? Subject { get; set; }

        [Required]
        public string? MessageContent { get; set; }

        public DateTime SentDate { get; set; } = DateTime.Now;
    }
}