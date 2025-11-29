namespace Backend.Entities
{
    public class CommentCreateDTO
    {
        public string text { get; set; } = null!;
        public long post_id { get; set; }
    }

    public class CommentUpdateDTO
    {
        public string text { get; set; } = null!;
    }
    public record CommentResponseDTO
    {
        public long id { get; set; }
        public string text { get; set; } = null!;
        public DateTime creationDate { get; set; } = DateTime.Now;
        public DateTime? editedDate { get; set; }
        public string authorUsername { get; set; } = null!;
        public long userId { get; set; }
        public bool canEdit { get; set; }
    }
}
