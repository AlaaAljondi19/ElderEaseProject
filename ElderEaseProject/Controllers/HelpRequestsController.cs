using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElderEaseProject.Data;
using ElderEase_Project.Models;
using Microsoft.AspNetCore.Authorization;

namespace ElderEaseProject.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    
    public class HelpRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HelpRequestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/HelpRequests?status=Pending
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HelpRequest>>> GetHelpRequests([FromQuery] string? status)
        {
            var query = _context.HelpRequests.AsQueryable();

            // الفلترة حسب الحالة المطلوبة في الجملة
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(h => h.Status == status);
            }

            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HelpRequest>> GetHelpRequest(int id)
        {
            var helpRequest = await _context.HelpRequests.FindAsync(id);

            if (helpRequest == null)
            {
                return NotFound(new { message = "الطلب غير موجود" });
            }

            return helpRequest;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutHelpRequest(int id, HelpRequest helpRequest)
        {
            if (id != helpRequest.Id)
            {
                return BadRequest(new { message = "بيانات الطلب غير متطابقة" });
            }

            _context.Entry(helpRequest).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HelpRequestExists(id))
                {
                    return NotFound(new { message = "الطلب غير موجود" });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "تم تحديث الطلب بنجاح" });
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<HelpRequest>> PostHelpRequest(HelpRequest helpRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "يرجى التأكد من البيانات" });
            }

            _context.HelpRequests.Add(helpRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHelpRequest", new { id = helpRequest.Id }, new { message = "تم إرسال طلبك بنجاح", data = helpRequest });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHelpRequest(int id)
        {
            var helpRequest = await _context.HelpRequests.FindAsync(id);
            if (helpRequest == null)
            {
                return NotFound(new { message = "الطلب غير موجود" });
            }

            _context.HelpRequests.Remove(helpRequest);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم حذف الطلب بنجاح" });
        }

        private bool HelpRequestExists(int id)
        {
            return _context.HelpRequests.Any(e => e.Id == id);
        }
    }
}
