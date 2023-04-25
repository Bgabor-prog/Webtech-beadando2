using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SeatManagement.Table
{
    public class Reservation
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }

        public int Version { get; set; }
        [ForeignKey("User")]
        public long? UserId { get; set; }

        [JsonIgnore]
        public virtual User? User { get; set; }

        [ForeignKey("Desk")]
     
        public long? DeskId { get; set; }

        [JsonIgnore]
        public virtual Desk? Desk { get; set; }

        public Reservation(int Id, DateTime dateFrom, DateTime dateTo)
        {
            this.Id = Id;
            this.DateFrom = dateFrom;
            this.DateTo = dateTo;
        }

        public Reservation()
        {


        }

        public Reservation(Reservation reservation)
        {
            this.Id = reservation.Id;
            this.DateFrom = reservation.DateFrom;
            this.DateTo = reservation.DateTo;
        }
    }
}
