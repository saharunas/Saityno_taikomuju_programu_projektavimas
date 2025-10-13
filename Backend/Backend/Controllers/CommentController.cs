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
    public class CommentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ValidationService _validationService;

        public CommentController(AppDbContext context, ValidationService validationService)
        {
            _context = context;
            _validationService = validationService;
        }

        [HttpGet("list/{post_id}")]
        public async Task<ActionResult<IEnumerable<Post>>> GetPostCommentList(long post_id)
        {
            var commentList = await _context.Comment.Where(p => p.PostId == post_id).ToListAsync();
            if (commentList == null || commentList.Count == 0)
            {
                return NotFound($"No comments found in post with ID {post_id}.");
            }
            return Ok(commentList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetComment(long id)
        {
            var comment = await _context.Comment.FindAsync(id);
            if (comment == null)
            {
                return NotFound($"Comment with ID {id} not found.");
            }
            return Ok(comment);
        }

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

            if (!await _validationService.UserExists(dto.user_id))
            {
                return NotFound($"User with ID {dto.user_id} not found.");
            }

            Comment comment = new Comment
            {
                Text = dto.text,
                UserId = dto.user_id,
                PostId = dto.post_id
            };

            comment.CreationDate = DateTime.UtcNow;

            _context.Comment.Add(comment);
            await _context.SaveChangesAsync();

            return StatusCode(201);
        }

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

            comment.Text = dto.text;
            comment.EditedDate = DateTime.UtcNow;

            _context.Comment.Update(comment);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var entity = await _context.Comment.FindAsync(id);
            if (entity == null) return NotFound();

            _context.Comment.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
