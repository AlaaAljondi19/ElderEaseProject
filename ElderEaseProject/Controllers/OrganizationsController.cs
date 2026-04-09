using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElderEaseProject.Data;
using ElderEaseProject.Models;

namespace ElderEaseProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrganizationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Organization>>> GetOrganizations(string? search)
        {
            var query = _context.Organizations.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(o => o.OrgName!.Contains(search) || o.Description!.Contains(search));
            }

            return await query.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Organization>> PostOrganization(Organization organization)
        {
            _context.Organizations.Add(organization);
            await _context.SaveChangesAsync();
            return Ok(organization);
        }
    }
}