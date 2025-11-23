using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PostController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ValidationService _validationService;

        public PostController(AppDbContext context, ValidationService validationService)
        {
            _context = context;
            _validationService = validationService;
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpGet("community/{comm_id}")]
        public async Task<ActionResult<IEnumerable<Post>>> GetCommunityPosts(long comm_id)
        {
            var postList = await _context.Post.Where(p => p.CommunityId == comm_id).ToListAsync();
            if (postList == null || postList.Count == 0)
            {
                return NotFound($"No posts found in community with ID {comm_id}.");
            }
            return Ok(postList);
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Post>> GetPost(long id)
        {
            var post = await _context.Post.FindAsync(id);
            if (post == null)
            {
                return NotFound($"Post with ID {id} not found.");
            }
            return Ok(post);
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreatePost([FromBody] PostCreateDTO dto)
        {
            if (!_validationService.ValidatePostDTO(dto))
            {
                if (dto == null)
                {
                    return BadRequest("Invalid post data.");
                }
                return UnprocessableEntity("Invalid post data.");
            }

            if (!await _validationService.CommunityExists(dto.community_id))
            {
                return NotFound($"Community with ID {dto.community_id} not found.");
            }

            Post post = new Post
            {
                Title = dto.title,
                Text = dto.text,
                UserId = long.Parse(HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)),
                CommunityId = dto.community_id
            };

            post.CreationDate = DateTime.UtcNow;

            _context.Post.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPost), new { id = post }, post);
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost([FromBody] PostUpdateDTO dto, long id)
        {
            if (!_validationService.ValidatePostDTO(dto))
            {
                if (dto == null)
                {
                    return BadRequest("Invalid post data.");
                }
                return UnprocessableEntity("Invalid post data.");
            }

            if (id <= 0)
            {
                return BadRequest("Invalid post ID.");
            }
            Post post = await _context.Post.FindAsync(id);

            if (post == null)
            {
                return NotFound($"Community with ID {id} not found.");
            }

            if (!HttpContext.User.IsInRole("Admin") && long.Parse(HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)) != post.UserId)
            {
               return Forbid();
            }

            post.Title = dto.title;
            post.Text = dto.text;

            _context.Post.Update(post);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var entity = await _context.Post.FindAsync(id);
            if (entity == null) return NotFound();

            if (!HttpContext.User.IsInRole("Admin") && long.Parse(HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)) != entity.UserId)
            {
               return Forbid();
            }

            _context.Post.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
