using Backend.Entities;
using Humanizer;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ValidationService
    {
        private readonly AppDbContext _context;

        public ValidationService(AppDbContext context)
        {
            _context = context;
        }

        #region Comment
        public async Task<bool> CommentExists(long commentId)
        {
            return await _context.Comment.AnyAsync(c => c.Id == commentId);
        }
        public bool ValidateCommentDTO(CommentCreateDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.text) || dto.post_id <= 0 || dto.user_id <= 0)
            {
                return false;
            }
            return true;
        }
        public bool ValidateCommentDTO(CommentUpdateDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.text))
            {
                return false;
            }
            return true;
        }
        #endregion
        #region Post
        public async Task<bool> PostExists(long postId)
        {
            return await _context.Post.AnyAsync(c => c.Id == postId);
        }
        public bool ValidatePostDTO(PostCreateDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.title) || string.IsNullOrWhiteSpace(dto.text) || dto.user_id <= 0 || dto.community_id <= 0)
            {
                return false;
            }
            return true;
        }
        public bool ValidatePostDTO(PostUpdateDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.title) || string.IsNullOrWhiteSpace(dto.text))
            {
                return false;
            }
            return true;
        }
        #endregion
        #region Community
        public async Task<bool> CommunityExists(long communityId)
        {
            return await _context.Community.AnyAsync(c => c.Id == communityId);
        }
        public bool ValidateCommunityDTO(CommunityCreateDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.name) || string.IsNullOrWhiteSpace(dto.description) || dto.user_id <= 0)
            {
                return false;
            }
            return true;
        }
        public bool ValidateCommunityDTO(CommunityUpdateDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.name) || string.IsNullOrWhiteSpace(dto.description))
            {
                return false;
            }
            return true;
        }
        #endregion
        #region User
        public async Task<bool> UserExists(long userId)
        {
            return await _context.App_User.AnyAsync(u => u.Id == userId);
        }

        public async Task<bool> UserExists(string username, string email)
        {
            return await _context.App_User.AnyAsync(u => u.UserName == username || u.Email == email);
        }
        public bool ValidateUserDTO(UserRegisterDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.name) || string.IsNullOrWhiteSpace(dto.surname) ||
                string.IsNullOrWhiteSpace(dto.username) || string.IsNullOrWhiteSpace(dto.email) ||
                string.IsNullOrWhiteSpace(dto.password))
            {
                return false;
            }
            return true;
        }
        public bool ValidateUserDTO(UserLoginDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.username) || string.IsNullOrWhiteSpace(dto.password))
            {
                return false;
            }
            return true;
        }

        public async Task<bool> ValidateLogin(UserLoginDTO dto)
        {
            var user = await _context.App_User
                .FirstOrDefaultAsync(u => u.UserName == dto.username); //TODO password check
            if (user == null)
            {
                return false;
            }
            return true;
        }
        #endregion
    }
}
