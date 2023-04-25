using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace SeatManagement.Table
{
    public class User
    {

        [Key]

        [JsonIgnore]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string TelephoneNumber { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        [StringLength(20)]
        public string Username { get; set; }

        [Required]
        [StringLength(100)]
        public string Password { get; set; }
        public string Role { get; set; }

        public string? ResetPasswordToken { get; set; }
        public DateTime? ResetPasswordTokenExpiration { get; set; }

        [JsonIgnore]
        public virtual ICollection<Reservation>? Reservations { get; set; }

        public User(long id, string firstName, string lastname, string telephoneNumber,string email, string username, string password, string role)
        {
            this.Id = id;
            this.FirstName = firstName;
            this.LastName = lastname;
            this.TelephoneNumber = telephoneNumber;
            this.Email = email;
            this.Username = username;
            this.Password = password;
            this.Role = role;
        }

        public User()
        {

        }

        public User(User user)
        {
            this.Id = user.Id;
            this.FirstName = user.FirstName;
            this.LastName = user.LastName;
            this.TelephoneNumber = user.TelephoneNumber;
            this.Email = user.Email;
            this.Username = user.Username;
            this.Password = user.Password;
        }

        public class LoginModel
        {
            public string Username { get; set; }
            public string Password { get; set; }

        }

        public class LoginResponse {
            public User User { get; set; }
            public string Token { get; set; }

            public long Id { get; set; }
        }

    }
}
