namespace Backend.Entities
{
    public class CommunityCreateDTO
    {
        public string name { get; set; } = null!;
        public string description { get; set; } = null!;
        public int user_id { get; set; }
    }
    public class CommunityUpdateDTO
    {
        public string name { get; set; } = null!;
        public string description { get; set; } = null!;
    }
}
