using System.ComponentModel.DataAnnotations;

namespace ElderEaseProject.Models
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;

        // Foreign Key for User
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}