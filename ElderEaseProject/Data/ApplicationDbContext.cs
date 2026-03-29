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


    }
}
