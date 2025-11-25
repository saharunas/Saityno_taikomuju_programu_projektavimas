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

        [Required]
        public required long UserId { get; set; }
        public User User { get; set; } = null!;

        public long PostId { get; set; }
        public Post Post { get; set; } = null!;

        public CommentResponseDTO toDto()
        {
            return new CommentResponseDTO
            {
                id = this.Id,
                text = this.Text,
                creationDate = this.CreationDate,
                editedDate = this.EditedDate
            };
        }
    }
}
