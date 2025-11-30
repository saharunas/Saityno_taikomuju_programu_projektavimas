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
        private readonly UserManager<User> _userManager;
        private readonly JwtTokenService _jwtTokenService;
        private readonly SessionService _sessionService;
        private readonly ValidationService _validationService;

        public UserController(
            AppDbContext context,
            UserManager<User> userManager,
            JwtTokenService jwtTokenService,
            SessionService sessionService,
            ValidationService validationService)
        {
            _context = context;
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _sessionService = sessionService;
            _validationService = validationService;
        }


        [HttpPost("register")]
        public async Task<IActionResult> registerUser([FromBody] UserRegisterDTO dto)
        {
            var checkUser = await _userManager.FindByNameAsync(dto.username);
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

            var createdUserResult = await _userManager.CreateAsync(user, dto.password);
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

            var role = await _userManager.AddToRoleAsync(user, "Member");
            if (role == null)
            {
                return UnprocessableEntity("Assigning role failed.");
            }

            return Created();
        }

        [HttpPost("login")]
        public async Task<IActionResult> loginUser([FromBody] UserLoginDTO dto)
        {
            var checkUser = await _userManager.FindByNameAsync(dto.username);
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

            var isPasswordValid = await _userManager.CheckPasswordAsync(checkUser, dto.password);
            if (!isPasswordValid)
            {
                return UnprocessableEntity("Incorrect username or password.");
            }
            //if (!await _validationService.ValidateLogin(dto))
            //{
            //    return NotFound($"User {dto.username} not found.");
            //}

            var roles = await _userManager.GetRolesAsync(checkUser);

            var sessionId = Guid.NewGuid();
            var expiresAt = DateTime.UtcNow.AddDays(3);
            var accessToken = _jwtTokenService.createAccessToken(checkUser.UserName, checkUser.Id.ToString(), roles);
            var refreshToken = _jwtTokenService.createRefreshToken(sessionId, checkUser.Id, expiresAt);

            await _sessionService.CreateSessionAsync(sessionId, checkUser.Id, refreshToken, expiresAt);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = expiresAt
            };

            HttpContext.Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);

            return Ok(new SuccessfulLoginDTO(accessToken));  
        }

        [HttpPost("accessToken")]
        public async Task<ActionResult<string>> getAccessToken()
        {
            if (!HttpContext.Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
            {
                return Unauthorized("Refresh token not found.");
            }
            if (!_jwtTokenService.tryParseRefreshToken(refreshToken, out var claims))
            {
                return Unauthorized("Invalid refresh token.");
            }

            var sessionId = claims.FindFirstValue("SessionId");
            if (sessionId == null)
            {
                return Unauthorized("Invalid refresh token.");
            }

            var sessionIdAsGuid = Guid.Parse(sessionId);
            if (!await _sessionService.IsSessionValidAsync(sessionIdAsGuid, refreshToken))
            {
                return Unauthorized("Invalid refresh token.");
            }

            var userId = claims.FindFirst(ClaimTypes.NameIdentifier)?.Value
                      ?? claims.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                      ?? claims.FindFirst("uid")?.Value;

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return UnprocessableEntity("User not found.");
            }

            var roles = await _userManager.GetRolesAsync(user);

            var expiresAt = DateTime.UtcNow.AddDays(3);
            var accessToken = _jwtTokenService.createAccessToken(user.UserName, user.Id.ToString(), roles);
            var newRefreshToken = _jwtTokenService.createRefreshToken(sessionIdAsGuid ,user.Id, expiresAt);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = expiresAt
            };

            HttpContext.Response.Cookies.Append("RefreshToken", newRefreshToken, cookieOptions);

            await _sessionService.ExtendSessionAsync(sessionIdAsGuid, newRefreshToken, expiresAt);


            return Ok(new SuccessfulLoginDTO(accessToken));
        }

        [HttpPost("logout")]
        public async Task<ActionResult<string>> logout()
        {
            if (!HttpContext.Request.Cookies.TryGetValue("RefreshToken", out var refreshToken))
            {
                return Unauthorized("Refresh token not found.");
            }
            if (!_jwtTokenService.tryParseRefreshToken(refreshToken, out var claims))
            {
                return Unauthorized("Invalid refresh token.");
            }

            var sessionId = claims.FindFirstValue("SessionId");
            if (sessionId == null)
            {
                return Unauthorized("Invalid refresh token.");
            }

            await _sessionService.InvalidateSessionAsync(Guid.Parse(sessionId));

            HttpContext.Response.Cookies.Delete("RefreshToken");

            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new UserAdminResponseDTO
                {
                    id = u.Id,
                    name = u.Name,
                    surname = u.Surname,
                    username = u.UserName,
                    email = u.Email,
                    role = (
                        from ur in _context.UserRoles
                        join r in _context.Roles on ur.RoleId equals r.Id
                        where ur.UserId == u.Id
                        select r.Name
                    ).FirstOrDefault()
                })
                .ToListAsync();
            if (users == null || users.Count == 0)
            {
                return NotFound("No users found.");
            }

            return Ok(users);
        }

        [Authorize(Roles = "Member, Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<User>>> GetUser(long id)
        {
            var user = await _context.App_User.FindAsync(id);
            if (user == null)
            {
                return NotFound($"No user with id {id} found.");
            }

            if (user.Id.ToString() != HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) && !HttpContext.User.IsInRole("Admin"))
            {
                return Forbid();
            }

            var responseDTO = user.toDto();

            return Ok(responseDTO);
        }

        [Authorize(Roles = "Admin")]
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

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var user = await _context.App_User.FindAsync(long.Parse(HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)));

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var responseDTO = new UserRoleDTO(
                role: HttpContext.User.IsInRole("Admin") ? "Admin" : "Member",
                id: user.Id.ToString()
            );

            return Ok(responseDTO);
        }

        public record SuccessfulLoginDTO(string AccessToken);

        public record UserRoleDTO(string role, string id);
    }
}
