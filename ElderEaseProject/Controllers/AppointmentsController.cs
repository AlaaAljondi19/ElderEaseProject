using ElderEase_Project.Models;
using ElderEaseProject.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ElderEaseProject.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Appointments/User/5
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments(int userId)
        {
            return await _context.Appointments
                .Where(a => a.UserId == userId)
                .ToListAsync();
        }

        // GET: api/Appointments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
            {
                return NotFound(new { message = "الموعد غير موجود" });
            }

            return appointment;
        }

        // PUT: api/Appointments/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAppointment(int id, Appointment appointment)
        {
            if (id != appointment.Id)
            {
                return BadRequest(new { message = "بيانات الموعد غير متطابقة" });
            }

            _context.Entry(appointment).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AppointmentExists(id))
                {
                    return NotFound(new { message = "الموعد غير موجود" });
                }
                else
                {
                    throw;
                }
            }

            return Ok(new { message = "تم تحديث الموعد بنجاح" });
        }

        // POST: api/Appointments
        [HttpPost]
        public async Task<ActionResult<Appointment>> PostAppointment(Appointment appointment)
        {
            bool hasConflict = await _context.Appointments.AnyAsync(a =>
                a.UserId == appointment.UserId &&
                a.AppointmentDate == appointment.AppointmentDate);

            if (hasConflict)
            {
                return BadRequest(new { message = "عذراً، يوجد موعد آخر محجوز في نفس هذا الوقت" });
            }

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAppointment", new { id = appointment.Id }, new { message = "تم حجز الموعد بنجاح", data = appointment });
        }

        // DELETE: api/Appointments/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound(new { message = "الموعد غير موجود" });
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم إلغاء الموعد بنجاح" });
        }

        private bool AppointmentExists(int id)
        {
            return _context.Appointments.Any(e => e.Id == id);
        }
    }
}