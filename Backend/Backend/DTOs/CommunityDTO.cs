namespace Backend.Entities
{
    public class CommunityDTO
    {
        public string name { get; set; } = null!;
        public string description { get; set; } = null!;
    }

    public record CommunityResponseDTO
    {
        public long id { get; set; }
        public string name { get; set; } = null!;
        public string description { get; set; } = null!;
        public DateTime creationDate { get; set; } = DateTime.Now;
        public string authorUsername { get; set; } = null!;
        public long userId { get; set; }
        public bool canEdit { get; set; }
    }
}
