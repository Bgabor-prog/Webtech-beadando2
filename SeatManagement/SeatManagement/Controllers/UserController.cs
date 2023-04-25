using Microsoft.AspNetCore.Mvc;
using DataAccess;
using SeatManagement.Table;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SeatManagement.Services;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Identity.UI.V4.Pages.Account.Internal;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit.Net.Smtp;

namespace SeatManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly SeatManagementContext _ctx;
        private readonly IPasswordHasherService _passwordHasher;
        private readonly IConfiguration _configuration;
        private readonly JwtSettings _jwtSettings;

        public UserController(ILogger<UserController> logger, SeatManagementContext ctx, IPasswordHasherService passwordHasher, IConfiguration configuration, IOptions<JwtSettings> jwtSettings)
        {
            _logger = logger;
            _ctx = ctx;
            _passwordHasher = passwordHasher;
            _configuration = configuration;
            _jwtSettings = jwtSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("Registration")]
        public ActionResult RegisterUser([FromBody] User user)
        {
            // Check if the user already exists in the database
            var existingUser = _ctx.User.FirstOrDefault(u => u.Username == user.Username);

            if (existingUser != null)
            {
                return BadRequest("Username already exists.");
            }

            var hashedPassword = _passwordHasher.HashPassword(user.Password);

            // Create a new user object with the input username and password
            var newUser = new User
            {
                Username = user.Username,
                Password = hashedPassword,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                TelephoneNumber = user.TelephoneNumber,
                Role = user.Role,
            };

            // Add the new user to the database
            _ctx.User.Add(newUser);
            _ctx.SaveChanges();

            return Ok(newUser);

        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public ActionResult Login([FromBody] User.LoginModel loginUser)
        {
            // Check if the user exists in the database
            var user = _ctx.User.FirstOrDefault(u => u.Username == loginUser.Username);
            if (user == null)
            {
                return Unauthorized();
            }

            // Check if the password is valid
            if (!_passwordHasher.VerifyPassword(loginUser.Password, user.Password))
            {
                return Unauthorized();
            }

            // Create a JWT token for the user
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["JWTSettings:SecretKey"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, "user")
                }),
                Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.TokenExpirationInMinutes),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            string serializedToken = tokenHandler.WriteToken(token);
            string jsonToken = JsonSerializer.Serialize(serializedToken);

            var loginResponse = new User.LoginResponse
            {
                User = user,
                Token = serializedToken,
                Id = user.Id,
            };

            return Ok(loginResponse);
        }

        [Authorize]
        [HttpGet("GetAllUserIds")]
        public ActionResult GetAllUserIds()
        {
            var result = _ctx.User.Select(d => d.Id).ToList();

            if (!result.Any())
            {
                return BadRequest("No users were found.");
            }

            return Ok(result);


        }


        [Authorize(Roles = "Admin")]
        [HttpPost("AddUsers")]
        public ActionResult Insert([FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.FirstName) || string.IsNullOrEmpty(user.LastName)
                || string.IsNullOrEmpty(user.TelephoneNumber) || string.IsNullOrEmpty(user.Email)
                || string.IsNullOrEmpty(user.Username) || string.IsNullOrEmpty(user.Password))
            {
                return BadRequest("All parameters should be given.");
            }

            User IsUserExist = _ctx.User.FirstOrDefault(item => item.Username == user.Username);

            if (IsUserExist != null)
            {
                return BadRequest($"User with this Username already exist! Check the parameters or try creating a new Username");
            }
            else
            {
                _ctx.User.Add(user);
            }

            _ctx.SaveChanges();

            return Ok();
        }

        
        [HttpPost("UpdateUser")]
        public ActionResult Update([FromBody] User user)
        {
            if (string.IsNullOrEmpty(user.Username))
            {
                return BadRequest("Username should be filled.");
            }

            User IsUserExist = _ctx.User.FirstOrDefault(item => item.Username == user.Username);

            if (IsUserExist != null)
            {
                IsUserExist.TelephoneNumber = user.TelephoneNumber;
                IsUserExist.LastName = user.LastName;
                IsUserExist.FirstName = user.FirstName;
                IsUserExist.LastName = user.LastName;
                IsUserExist.Password = user.Password;
            }
            else
            {
                return BadRequest("User not found! Check the parameters or try registrate a new User.");
            }

            _ctx.SaveChanges();

            return Ok();
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("DeleteUser")]
        public ActionResult Delete(int id)
        {

            var user = _ctx.User.FirstOrDefault(u => u.Id == id);

            if (id == 0)
            {
                return BadRequest("User Id should be given.");
            }

            if (user == null)
            {
                return BadRequest("The data record is not exists.");
            }

            _ctx.User.Remove(user);

            _ctx.SaveChanges();

            return Ok("The User was deleted successfully!");
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _ctx.User.SingleOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Generate a token and set its expiration
            user.ResetPasswordToken = Guid.NewGuid().ToString();
            user.ResetPasswordTokenExpiration = DateTime.UtcNow.AddHours(1);

            await _ctx.SaveChangesAsync();

            // Send the password reset email
            await SendPasswordResetEmail(user.Email, user.ResetPasswordToken);

            return Ok(new { message = "Password reset email sent" });
        }

        //[Authorize(Roles = "Admin")]
        //[HttpPost("UpdateUserRole")]
        //public async Task<IActionResult> UpdateUserRole(string userId, UserRole newRole)
        //{
        //    var user = await _userManager.FindByIdAsync(userId);
        //    if (user == null)
        //    {
        //        return NotFound("User not found");
        //    }

        //    user.Role = newRole;
        //    await _userManager.UpdateAsync(user);

        //    return Ok();
        //}

        private async Task SendPasswordResetEmail(string email, string token)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("SeatManagement", "noreply@seatmanagement.com"));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = "Password Reset";

            var bodyBuilder = new BodyBuilder
            {
            HtmlBody = 
            $@"
            <html>
                <head>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            font-size: 16px;
                            color: #333;
                        }}

                        .container {{
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            box-sizing: border-box;
                            background-color: #ffffff;
                        }}

                        h1 {{
                            font-size: 24px;
                            margin-bottom: 20px;
                        }}

                        p {{
                            margin-bottom: 10px;
                        }}

                        a {{
                            color: #2a9df4;
                            text-decoration: none;
                        }}

                        a:hover {{
                            text-decoration: underline;
                        }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <h1>Password Reset</h1>
                        <p>Hi,</p>
                        <p>You requested to reset your password. Please click the link below to reset your password:</p>
                        <p><a href='https://localhost:44470/reset-password?token={token}'>Reset Password</a></p>
                        <p>If you did not request this password reset, please ignore this email.</p>
                        <p>Best regards,</p>
                        <p>SeatManagement Team</p>
                    </div>
                </body>
            </html>"
            };

            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                client.Connect(_configuration["EmailSettings:SmtpServer"], int.Parse(_configuration["EmailSettings:SmtpPort"]));
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
        }

        [HttpPost("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            var user = await _ctx.User.SingleOrDefaultAsync(u => u.ResetPasswordToken == request.Token && u.ResetPasswordTokenExpiration > DateTime.UtcNow);

            if (user == null)
            {
                return BadRequest(new { message = "Invalid token or token has expired" });
            }

            // Update user password and reset the token and its expiration
            user.Password = _passwordHasher.HashPassword(request.NewPassword);
            user.ResetPasswordToken = null;
            user.ResetPasswordTokenExpiration = null;

            await _ctx.SaveChangesAsync();

            return Ok(new { message = "Password has been reset successfully" });
        }

        public class ForgotPasswordRequest
        {
            public string Email { get; set; }
        }

        public class ResetPasswordRequest
        {
            public string Token { get; set; }
            public string NewPassword { get; set; }
        }
    }

}

