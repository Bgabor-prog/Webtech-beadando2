using DataAccess;
using Microsoft.AspNetCore.Identity;
using SeatManagement.Table;

namespace SeatManagement
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            var configurationBuilder = new ConfigurationBuilder()
                                        .SetBasePath(Directory.GetCurrentDirectory())
                                        .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            var builder = WebApplication.CreateBuilder(args);

            IConfiguration configuration = configurationBuilder.Build();
            var startup = new Startup(configuration);

            startup.ConfigureServices(builder.Services);

            var app = builder.Build();

            startup.Configure(app);

            app.Run();
        }
    }
}