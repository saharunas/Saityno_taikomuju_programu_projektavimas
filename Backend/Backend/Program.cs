using Microsoft.EntityFrameworkCore;
using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:8081",
                    "http://localhost:19006",
                    "http://127.0.0.1:8081"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddScoped<ValidationService>();
builder.Services.AddScoped<IdentitySeeder>();
builder.Services.AddScoped<SessionService>();
builder.Services.AddTransient<JwtTokenService>();

builder.Services.AddIdentity<User, IdentityRole<long>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.MapInboundClaims = false;
    options.TokenValidationParameters.ValidAudience = builder.Configuration["Jwt:ValidAudience"];
    options.TokenValidationParameters.ValidIssuer = builder.Configuration["Jwt:ValidIssuer"];
    options.TokenValidationParameters.IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]));
});

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<User>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole<long>>>();

    await IdentitySeeder.SeedIdentityData(userManager, roleManager);
}


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();
app.UseResponseCaching();
app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();
app.Run();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

