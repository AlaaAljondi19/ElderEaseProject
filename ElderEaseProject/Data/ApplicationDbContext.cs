using ElderEase_Project.Models;
using ElderEaseProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace ElderEaseProject.Data
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

       
        public DbSet<Volunteer> Volunteers { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<ContactMessage> ContactMessages { get; set; }

        public DbSet<HelpRequest> HelpRequests { get; set; }

        public DbSet<Appointment> Appointments { get; set; }


        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}
