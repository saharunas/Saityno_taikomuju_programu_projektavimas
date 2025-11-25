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
        public string text { get; set; } = null!;
        public DateTime creationDate { get; set; } = DateTime.Now;
        public DateTime? editedDate { get; set; }
    }
}
