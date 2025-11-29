using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ValidationService _validationService;

        public CommentController(AppDbContext context, ValidationService validationService)
        {
            _context = context;
            _validationService = validationService;
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpGet("post/{post_id}")]
        public async Task<ActionResult<IEnumerable<Post>>> GetPostCommentList(long post_id)
        {
            var commentList = await _context.Comment.Where(p => p.PostId == post_id).Include(c => c.User).ToListAsync();
            if (commentList == null || commentList.Count == 0)
            {
                return NotFound($"No comments found in post with ID {post_id}.");
            }

            var userId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            bool isAdmin = HttpContext.User.IsInRole("Admin");

            var responseDTO = commentList.Select(p => p.toDto(long.Parse(userId), isAdmin)).ToList();

            return Ok(responseDTO);
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetComment(long id)
        {
            var comment = await _context.Comment.FindAsync(id);
            if (comment == null)
            {
                return NotFound($"Comment with ID {id} not found.");
            }

            await _context.Entry(comment)
                .Reference(c => c.User)
                .LoadAsync();

            var userId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            bool isAdmin = HttpContext.User.IsInRole("Admin");

            var responseDTO = comment.toDto(long.Parse(userId), isAdmin);

            return Ok(responseDTO);
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CommentCreateDTO dto)
        {
            if (!_validationService.ValidateCommentDTO(dto))
            {
                if (dto == null)
                {
                    return BadRequest("Invalid comment data.");
                }
                return UnprocessableEntity("Invalid comment data.");
            }

            if (!await _validationService.PostExists(dto.post_id))
            {
                return NotFound($"Post with ID {dto.post_id} not found.");
            }

            var user = await _context.Users.FindAsync(long.Parse(HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)));
            if (user == null)
            {
                return NotFound("User not found.");
            }

            Comment comment = new Comment
            {
                Text = dto.text,
                UserId = user.Id,
                PostId = dto.post_id,
                User = user                
            };

            comment.CreationDate = DateTime.UtcNow;

            _context.Comment.Add(comment);
            await _context.SaveChangesAsync();

            var userId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            bool isAdmin = HttpContext.User.IsInRole("Admin");

            var responseDTO = comment.toDto(long.Parse(userId), isAdmin);

            return CreatedAtAction(nameof(GetComment), new { id = comment }, responseDTO);
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment([FromBody] CommentUpdateDTO dto, long id)
        {
            if (!_validationService.ValidateCommentDTO(dto))
            {
                if (dto == null)
                {
                    return BadRequest("Invalid comment data.");
                }
                return UnprocessableEntity("Invalid comment data.");
            }

            if (id <= 0)
            {
                return BadRequest("Invalid comment ID.");
            }

            Comment comment = await _context.Comment.FindAsync(id);
            if (comment == null)
            {
                return NotFound($"Comment with ID {id} not found.");
            }    
            
            if (!HttpContext.User.IsInRole("Admin") && long.Parse(HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)) != comment.UserId)
            {
               return Forbid();
            }

            comment.Text = dto.text;
            comment.EditedDate = DateTime.UtcNow;

            _context.Comment.Update(comment);
            await _context.SaveChangesAsync();

            await _context.Entry(comment)
                .Reference(c => c.User)
                .LoadAsync();

            var userId = HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            bool isAdmin = HttpContext.User.IsInRole("Admin");

            var responseDTO = comment.toDto(long.Parse(userId), isAdmin);

            return Ok(responseDTO);
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var entity = await _context.Comment.FindAsync(id);
            if (entity == null) return NotFound();

            if (!HttpContext.User.IsInRole("Admin") && long.Parse(HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)) != entity.UserId)
            {
               return Forbid();
            }

            _context.Comment.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
