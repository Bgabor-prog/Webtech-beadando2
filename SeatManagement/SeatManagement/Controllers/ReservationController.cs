using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SeatManagement.Table;

namespace SeatManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationController : ControllerBase
    {

        private readonly ILogger<ReservationController> _logger;
        private readonly SeatManagementContext _ctx;

        public ReservationController(ILogger<ReservationController> logger, SeatManagementContext ctx)
        {
            _logger = logger;
            _ctx = ctx;

        }

        //[Authorize]
        [HttpGet("/api/Reservation/GetReservations")]
        public ActionResult GetReservations()
        {
            return Ok(_ctx.Reservation.Include(u => u.User)
                                      .Include(d => d.Desk)
                                      .ToList());                                                            
        }

        [Authorize]
        [HttpGet("GetReservedDeskIds")]
        public ActionResult GetReservedDeskIds(DateTime startDate, DateTime endDate)
        {
            var reservedDeskIds = _ctx.Reservation
                .Where(r => r.DateFrom <= endDate && r.DateTo >= startDate)
                .Select(d => d.DeskId)
                .ToList();

            return Ok(reservedDeskIds);
        }

        [Authorize]
        [HttpGet("/api/Reservation")]
        public ActionResult<Reservation> GetReservationById(int reservationId)
        {
            if (reservationId == 0)
            {
                return BadRequest("Reservation Id should not be empty or null.");
            }
            if (!_ctx.Reservation.Where(item => item.Id == reservationId).Any())
            {
                return BadRequest($"Reservation '{reservationId}' not exists.");
            }

            var result = _ctx.Reservation.Include(u => u.User)
                                         .Include(d => d.Desk)
                                         .Where(item => item.Id == reservationId)
                                         .FirstOrDefault();


            return Ok(result);
        }

        [Authorize]
        [HttpPost("AddReservation")]
        public async Task<ActionResult> Insert(long UserId, long DeskId, [FromBody] Reservation reservation)
        {
            // Check if the DeskId exists in the Desk table
            var desk = _ctx.Desk.FirstOrDefault(d => d.Id == DeskId);
            if (desk == null)
            {
                return BadRequest("The Desk Id does not exist.");
            }

            // Check if the UserId exists in the User table
            var user = _ctx.User.FirstOrDefault(u => u.Id == UserId);
            if (user == null)
            {
                return BadRequest("The User Id does not exist.");
            }

            // Check for overlapping reservations
            var overlappingReservation = _ctx.Reservation.Any(r => r.DeskId == DeskId && (
                (reservation.DateFrom >= r.DateFrom && reservation.DateFrom < r.DateTo) ||
                (reservation.DateTo > r.DateFrom && reservation.DateTo <= r.DateTo) ||
                (reservation.DateFrom <= r.DateFrom && reservation.DateTo >= r.DateTo)
            ));

            if (overlappingReservation)
            {
                return BadRequest("There is already a reservation for the given time range.");
            }

            // Begin transaction
            using (var transaction = _ctx.Database.BeginTransaction())
            {
                try
                {
                    reservation.DeskId = DeskId;
                    reservation.UserId = UserId;

                    reservation.Version += 1;


                    _ctx.Reservation.Add(reservation);

                    _ctx.Entry(desk).State = EntityState.Modified;

                    await _ctx.SaveChangesAsync();

                    // Commit transaction
                    transaction.Commit();
                }
                catch (DbUpdateConcurrencyException)
                {
                    // Roll back transaction
                    transaction.Rollback();
                    return Conflict("The reservation could not be completed due to a conflict.");
                }
                catch (Exception e)
                {
                    // Roll back transaction and log the error
                    transaction.Rollback();
                    return StatusCode(500, "An error occurred while processing your request.");
                }
            }

            return Ok(new { message = "The reservation was added successfully." });
        }

        //[Authorize]
        [HttpPost("UpdateReservation")]
        public ActionResult Update([FromBody] Reservation reservation)
        {
            Reservation IsReservationExist = _ctx.Reservation.FirstOrDefault(item => item.Id == reservation.Id);

            if (IsReservationExist != null)
            {
                IsReservationExist.DateFrom = reservation.DateFrom;
                IsReservationExist.DateTo = reservation.DateTo;
            }
            else
            {
                 return BadRequest("Reservation not found! Check the parameters or make a reservation.");   
            }

            return Ok();
        }

        [Authorize]
        [HttpDelete("/api/Reservation")]
        public ActionResult Delete(int Id)
        {
            if (Id == null)
            {
                return BadRequest("Reservation Id should be given.");
            }

            Reservation reservation = _ctx.Reservation.FirstOrDefault(item => item.Id == Id);
            if (reservation == null)
            {
                return BadRequest("The data record is not exists.");
            }

            _ctx.Reservation.Remove(reservation);

            _ctx.SaveChanges();

            return Ok();
        }

        [HttpGet("GetReservationsByUserId/{userId}")]
        public IActionResult GetReservationsByUserId(long userId)
        {
            // Check if the UserId exists in the User table
            var user = _ctx.User.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return BadRequest("The User Id does not exist.");
            }

            // Get all reservations for the given UserId
            var reservations = _ctx.Reservation.Where(r => r.UserId == userId).ToList();

            return Ok(reservations);
        }

    }
}
