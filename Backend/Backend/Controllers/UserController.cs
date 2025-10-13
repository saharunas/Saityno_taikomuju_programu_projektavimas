using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

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
        public async Task<IActionResult> RegisterUser([FromBody] UserRegisterDTO dto)
        {
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
                Username = dto.username,
                Email = dto.email,
                Password = dto.password,
                RoleId = dto.role_id
            };

            _context.App_User.Add(user);
            await _context.SaveChangesAsync();

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] UserLoginDTO dto)
        {
            if (!_validationService.ValidateUserDTO(dto))
            {
                if (dto == null)
                {
                    return BadRequest("Invalid user data.");
                }
                return UnprocessableEntity("Invalid user data.");
            }
            if (!await _validationService.ValidateLogin(dto))
            {
                return NotFound($"User {dto.username} not found.");
            }
            return Ok($"User {dto.username} logged in successfully");
        }

        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _context.App_User.ToListAsync();
            if (users == null || users.Count == 0)
            {
                return NotFound("No users found.");
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
    }
}
