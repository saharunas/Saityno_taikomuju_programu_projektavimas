using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class Community
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; } = "";
        public DateTime CreationDate { get; set; }
        public string Description { get; set; } = "";

        // FK to User (creator/owner)
        public long UserId { get; set; }
        public User User { get; set; } = null!;

        public ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}
