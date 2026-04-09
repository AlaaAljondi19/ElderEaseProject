using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElderEaseProject.Data;
using ElderEaseProject.Models;

namespace ElderEaseProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VolunteersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VolunteersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Volunteer>>> GetVolunteers(string? specialty)
        {
            var query = _context.Volunteers.AsQueryable();

            if (!string.IsNullOrEmpty(specialty))
            {
                query = query.Where(v => v.Specialization == specialty);
            }

            return await query.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Volunteer>> PostVolunteer(Volunteer volunteer)
        {
            _context.Volunteers.Add(volunteer);
            await _context.SaveChangesAsync();
            return Ok(volunteer);
        }
    }
}