namespace Backend.Entities
{
    public class PostCreateDTO
    {
        public string title { get; set; } = null!;
        public string text { get; set; } = null!;
        public int community_id { get; set; }
    }

    public class PostUpdateDTO
    {
        public string title { get; set; } = null!;
        public string text { get; set; } = null!;
    }

    public record PostResponseDTO
    {
        public long id { get; set; }
        public string title { get; set; } = null!;
        public string text { get; set; } = null!;
        public DateTime creationDate { get; set; } = DateTime.Now;
    }
}
