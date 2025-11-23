using Backend.Entities;
using Backend.Services;
using Humanizer;
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
    public class CommunityController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ValidationService _validationService;

        public CommunityController(AppDbContext context, ValidationService validationService)
        {
            _context = context;
            _validationService = validationService;
        }

        [Authorize(Roles = "Guest,Member,Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Community>>> GetCommunities()
        {
            var communityList = await _context.Community.ToListAsync();
            if (communityList == null || communityList.Count == 0)
            {
                return NotFound("No communities found.");
            }
            return Ok(communityList);
        }

        [Authorize(Roles = "Guest,Member,Admin")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Community>> GetCommunity(long id)
        {
            var community = await _context.Community.FindAsync(id);
            if (community == null)
            {
                return NotFound($"Community with ID {id} not found.");
            }
            return Ok(community);
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateCommunity([FromBody] CommunityDTO communityDto)
        {
            if (!_validationService.ValidateCommunityDTO(communityDto))
            {
                if (communityDto == null)
                {
                    return BadRequest("Invalid community data.");
                }
                return UnprocessableEntity("Invalid community data.");
            }

            Community community = new Community
            {
                Name = communityDto.name,
                Description = communityDto.description,
                UserId = long.Parse(HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub))
            };

            community.CreationDate = DateTime.UtcNow;

            _context.Community.Add(community);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCommunity), new { id = community }, community);
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCommunity([FromBody] CommunityDTO communityDto, long id)
        {
            if (!_validationService.ValidateCommunityDTO(communityDto))
            {
                if (communityDto == null)
                {
                    return BadRequest("Invalid community data.");
                }
                return UnprocessableEntity("Invalid community data.");
            }

            if (id <= 0)
            {
                return BadRequest("Invalid community ID.");
            }

            Community community = await _context.Community.FindAsync(id);
            if (community == null)
            {
                return NotFound($"Community with ID {id} not found.");
            }

            if (!HttpContext.User.IsInRole("Admin") && long.Parse(HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)) != community.UserId)
            {
               return Forbid();
            }

            community.Name = communityDto.name;
            community.Description = communityDto.description;

            _context.Community.Update(community);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize(Roles = "Member,Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var entity = await _context.Community.FindAsync(id);
            if (entity == null) return NotFound();

            if (!HttpContext.User.IsInRole("Admin") && long.Parse(HttpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)) != entity.UserId)
            {
               return Forbid();
            }

            _context.Community.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{community_id}/posts/comments")]
        public async Task<ActionResult<IEnumerable<Comment>>> GetCommentsByCommunityId(long community_id)
        {
            var posts = await _context.Post.Where(p => p.CommunityId == community_id)
                .Select(p => p.Id)
                .ToListAsync();
            if (posts == null || posts.Count == 0)
            {
                return NotFound($"No posts found for community ID {community_id}.");
            }

            var comments = await _context.Comment
                .Where(c => posts.Contains(c.PostId))
                .ToListAsync();
            if (comments == null || comments.Count == 0)
            {
                return NotFound($"No comments found for community ID {community_id}.");
            }
            return Ok(comments);
        }
    }
}
