using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using SeatManagement.Table;

namespace DataAccess
{
    public class SeatManagementContext : DbContext
    {
      

        public SeatManagementContext(DbContextOptions<SeatManagementContext> options) : base(options)
        {

        }


        public DbSet<Desk> Desk { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<Reservation> Reservation { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<Reservation>()
       .Property(r => r.Version)
       .IsConcurrencyToken();

            modelBuilder
               .Entity<Desk>()
               .ToTable("Desk", b => b.IsTemporal());

            modelBuilder
               .Entity<Reservation>()
               .ToTable("Reservation", b => b.IsTemporal());

            modelBuilder
               .Entity<User>()
               .ToTable("User", b => b.IsTemporal());

        }
    }
}