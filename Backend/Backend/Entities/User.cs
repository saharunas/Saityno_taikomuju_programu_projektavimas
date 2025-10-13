using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class User
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public string Username { get; set; } = "";
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public long RoleId { get; set; }
        public UserRole Role { get; set; } = null!;
        public bool Blocked { get; set; } = false;

        public ICollection<Community> Communities { get; set; } = new List<Community>();
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}
