using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElderEaseProject.Data;
using ElderEaseProject.Models;

namespace ElderEaseProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactMessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ContactMessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactMessage>>> GetMessages()
        {
            return await _context.ContactMessages.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<ContactMessage>> PostMessage(ContactMessage message)
        {
            _context.ContactMessages.Add(message);
            await _context.SaveChangesAsync();
            return Ok(message);
        }
    }
}