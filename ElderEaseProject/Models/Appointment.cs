using ElderEaseProject.Models;

namespace ElderEase_Project.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string? Status { get; set; }
        public string? PatientName { get; set; }
        public string? Description { get; set; }


        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}