namespace Backend.Entities
{
    public class PostCreateDTO
    {
        public string title { get; set; } = null!;
        public string text { get; set; } = null!;
        public int community_id { get; set; }
        public int user_id { get; set; }
    }

    public class PostUpdateDTO
    {
        public string title { get; set; } = null!;
        public string text { get; set; } = null!;
    }
}
