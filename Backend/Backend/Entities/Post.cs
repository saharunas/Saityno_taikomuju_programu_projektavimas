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

        public long UserId { get; set; }
        public User User { get; set; } = null!;

        public long CommunityId { get; set; }
        public Community Community { get; set; } = null!;

        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
