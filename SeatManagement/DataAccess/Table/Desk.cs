using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SeatManagement.Table
{
    public class Desk
    {
        [Key]
        [JsonIgnore]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }
        public int MaxCapacity { get; set; }
        public int SeatNumber { get; set; }

        [JsonIgnore]
        public virtual ICollection<Reservation>? Reservations { get; set; }

        public Desk(long deskId, int maxCapacity, int seatNumber,int version)
        {
            this.Id = deskId;
            this.MaxCapacity = maxCapacity;
            this.SeatNumber = seatNumber;
        }

        public Desk()
        {
        }

        public Desk(Desk desk)
        {
            this.Id = desk.Id;
            this.MaxCapacity = desk.MaxCapacity;
            this.SeatNumber = desk.SeatNumber;
           
        }
    }
}
