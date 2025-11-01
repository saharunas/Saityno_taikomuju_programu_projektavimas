using Backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace Backend.Services
{
    public class IdentitySeeder
    {
        public static async Task SeedIdentityData(UserManager<User> userManager, RoleManager<IdentityRole<long>> roleManager)
        {
            string[] roles = { "Admin", "Member", "Guest" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<long> { Name = role });
                }
            }

            // Seed admin user
            var adminUser = await userManager.FindByNameAsync("admin");

            if (adminUser == null)
            {
                adminUser = new User
                {
                    UserName = "admin",
                    Email = "admin@local.com",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, "Admin123!");

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }
    }
}
