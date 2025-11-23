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
}
