using DataAccess;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SeatManagement.Table;
using System.Linq;

namespace SeatManagement.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class DeskController : ControllerBase
    {
        private readonly ILogger<DeskController> _logger;
        private readonly SeatManagementContext _ctx;

        public DeskController(ILogger<DeskController> logger, SeatManagementContext ctx)
        {
            _logger = logger;
            _ctx = ctx;

        }

        //[Authorize]
        [HttpGet("GetAllDeskIds")]
        public ActionResult GetAllDeskIds()
        {
            var result = _ctx.Desk.Select(d => d.Id).ToList();

            if (!result.Any()) 
            { 
                return BadRequest("No desks were found.");
            }

            return Ok(result);


        }

        [Authorize]
        [HttpPost("AddDesk")]
        public ActionResult Insert([FromBody] Desk desk)
        {
            if (desk.MaxCapacity == 0)
            {
                return BadRequest("Desk maximum capacity should be filled.");
            }

            Desk IsDeskExist = _ctx.Desk.FirstOrDefault(item => item.Id == desk.Id);

            if (IsDeskExist != null)
            {
               return BadRequest($"Desk already exist! Check the parameters or try updating this '{IsDeskExist.Id}' room.");
            }
            else
            {
                _ctx.Desk.Add(desk);
            }

            _ctx.SaveChanges();

            return Ok();
        }

        //[Authorize]
        [HttpPost("UpdateDesk")]
        public ActionResult Update([FromBody] Desk desk)
        {
            if (desk.Id == 0)
            {
                return BadRequest("Desk Id should be filled.");
            }

            Desk IsDeskExist = _ctx.Desk.FirstOrDefault(item => item.Id == desk.Id);

            if (IsDeskExist != null)
            {
                IsDeskExist.MaxCapacity = desk.MaxCapacity;
                IsDeskExist.SeatNumber = desk.SeatNumber;
            }
            else
            {
                 return BadRequest("Desk not found! Check the parameters or try creating a new desk.");
            }

            _ctx.SaveChanges();

            return Ok();
        }

        //[Authorize]
        [HttpDelete("/api/Desk")]
        public ActionResult Delete(int Id)
        {

            var desk = _ctx.Desk.FirstOrDefault(d => d.Id == Id);

            if (Id == 0)
            {
                return BadRequest("Desk Id should be given.");
            }

            if (desk == null)
            {
                return BadRequest("The data record is not exists.");
            }

            _ctx.Desk.Remove(desk);

            _ctx.SaveChanges();

            return Ok("The Desk was deleted successfully!");
        }
    }
}
