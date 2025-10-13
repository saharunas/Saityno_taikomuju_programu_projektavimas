using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class Comment
    {
        [Key]
        public long Id { get; set; }
        public string Text { get; set; } = "";
        public DateTime CreationDate { get; set; }
        public DateTime? EditedDate { get; set; }

        public long UserId { get; set; }
        public User User { get; set; } = null!;

        public long PostId { get; set; }
        public Post Post { get; set; } = null!;
    }
}
