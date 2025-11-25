using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class Post
    {
        [Key]
        public long Id { get; set; }
        public string Title { get; set; } = "";
        public string Text { get; set; } = "";
        public DateTime CreationDate { get; set; }

        [Required]
        public required long UserId { get; set; }
        public User User { get; set; } = null!;

        public long CommunityId { get; set; }
        public Community Community { get; set; } = null!;

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();

        public PostResponseDTO toDto()
        {
            return new PostResponseDTO
            {
                id = this.Id,
                title = this.Title,
                text = this.Text,
                creationDate = this.CreationDate
            };
        }
    }
}
