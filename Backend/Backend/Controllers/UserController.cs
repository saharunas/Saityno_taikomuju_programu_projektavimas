using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ValidationService _validationService;

        public UserController(AppDbContext context, ValidationService validationService)
        {
            _context = context;
            _validationService = validationService;
        }


        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser(UserManager<User> userManager, [FromBody] UserRegisterDTO dto)
        {
            var checkUser = await userManager.FindByNameAsync(dto.username);
            if (checkUser != null)
            {
                return UnprocessableEntity("Username already exists.");
            }

            if (!_validationService.ValidateUserDTO(dto))
            {
                if (dto == null)
                {
                    return BadRequest("Invalid user data.");
                }
                return UnprocessableEntity("Invalid user data.");
            }

            if (await _validationService.UserExists(dto.username, dto.email))
            {
                return Conflict("Username or email already exists.");
            }            

            User user = new User
            {
                Name = dto.name,
                Surname = dto.surname,
                UserName = dto.username,
                Email = dto.email
            };

            var createdUserResult = await userManager.CreateAsync(user, dto.password);
            if (!createdUserResult.Succeeded)
            {
                var errors = createdUserResult.Errors.Select(e => new
                {
                    Code = e.Code,
                    Description = e.Description
                });

                return StatusCode(StatusCodes.Status422UnprocessableEntity, new
                {
                    Message = "User creation failed",
                    Errors = errors
                });
            }

            var role = await userManager.AddToRoleAsync(user, "Member");
            if (role == null)
            {
                return UnprocessableEntity("Assigning role failed.");
            }

            return Created();
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser(UserManager<User> userManager, JwtTokenService jwtTokenService, [FromBody] UserLoginDTO dto)
        {
            var checkUser = await userManager.FindByNameAsync(dto.username);
            if (checkUser == null)
            {
                return UnprocessableEntity("User does not exist.");
            }

            if (!_validationService.ValidateUserDTO(dto))
            {
                if (dto == null)
                {
                    return BadRequest("Invalid user data.");
                }
                return UnprocessableEntity("Invalid user data.");
            }

            var isPasswordValid = await userManager.CheckPasswordAsync(checkUser, dto.password);
            if (!isPasswordValid)
            {
                return UnprocessableEntity("Incorrect username or password.");
            }
            //if (!await _validationService.ValidateLogin(dto))
            //{
            //    return NotFound($"User {dto.username} not found.");
            //}

            var roles = await userManager.GetRolesAsync(checkUser);

            var expiresAt = DateTime.Now.AddDays(3);
            var accessToken = jwtTokenService.createAccessToken(checkUser.UserName, checkUser.Id.ToString(), roles);
            var refreshToken = jwtTokenService.createRefreshToken(checkUser.Id.ToString(), expiresAt);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Expires = expiresAt,
                Secure = false
            };

            HttpContext.Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);

            return Ok(new SuccessfulLoginDTO(accessToken));  
        }

        [HttpPost("accessToken")]
        public async Task<ActionResult<string>> getAccessToken(UserManager<User> userManager, JwtTokenService jwtTokenService)
        {
            if (!HttpContext.Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
            {
                return Unauthorized("Refresh token not found.");
            }
            if (!jwtTokenService.tryParseRefreshToken(refreshToken, out var claims))
            {
                return Unauthorized("Invalid refresh token.");
            }

            var userId = claims.FindFirst(ClaimTypes.NameIdentifier)?.Value
                      ?? claims.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                      ?? claims.FindFirst("uid")?.Value;

            var user = await userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return UnprocessableEntity("User not found.");
            }

            var roles = await userManager.GetRolesAsync(user);

            var expiresAt = DateTime.Now.AddDays(3);
            var accessToken = jwtTokenService.createAccessToken(user.UserName, user.Id.ToString(), roles);
            var newRefreshToken = jwtTokenService.createRefreshToken(user.Id.ToString(), expiresAt);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Lax,
                Expires = expiresAt,
                Secure = false
            };

            HttpContext.Response.Cookies.Append("RefreshToken", newRefreshToken, cookieOptions);


            return Ok(new SuccessfulLoginDTO(accessToken));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _context.App_User.ToListAsync();
            if (users == null || users.Count == 0)
            {
                return NotFound("No users found.");
            }
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<User>>> GetUser(long id)
        {
            var users = await _context.App_User.FindAsync(id);
            if (users == null)
            {
                return NotFound($"No user with id {id} found.");
            }
            return Ok(users);
        }

        [HttpPost("block/{id}")]
        public async Task<IActionResult> BlockUser(long id)
        {
            if (!await _validationService.UserExists(id))
            {
                return NotFound($"User with ID {id} not found.");
            }

            var user = await _context.App_User.FindAsync(id);
            user.Blocked = true;

            _context.App_User.Update(user);
            await _context.SaveChangesAsync();
            return Ok($"User {id} blocked successfully");
        }

        public record SuccessfulLoginDTO(string AccessToken);
    }
}
