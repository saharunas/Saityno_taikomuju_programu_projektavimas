using Backend.Entities;
using Backend.Services;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

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

        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<Community>>> GetCommunities()
        {
            var communityList = await _context.Community.ToListAsync();
            if (communityList == null || communityList.Count == 0)
            {
                return NotFound("No communities found.");
            }
            return Ok(communityList);
        }

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

        [HttpPost]
        public async Task<IActionResult> CreateCommunity([FromBody] CommunityCreateDTO communityDto)
        {
            if (!_validationService.ValidateCommunityDTO(communityDto))
            {
                if (communityDto == null)
                {
                    return BadRequest("Invalid community data.");
                }
                return UnprocessableEntity("Invalid community data.");
            }

            if (!await _validationService.UserExists(communityDto.user_id))
            {
                return NotFound($"User with ID {communityDto.user_id} not found.");
            }

            Community community = new Community
            {
                Name = communityDto.name,
                Description = communityDto.description,
                UserId = communityDto.user_id
            };

            community.CreationDate = DateTime.UtcNow;

            _context.Community.Add(community);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCommunity), new { id = community }, community);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCommunity([FromBody] CommunityUpdateDTO communityDto, long id)
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

            community.Name = communityDto.name;
            community.Description = communityDto.description;

            _context.Community.Update(community);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var entity = await _context.Community.FindAsync(id);
            if (entity == null) return NotFound();

            _context.Community.Remove(entity);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        [HttpGet("commentsList/{community_id}")]
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
