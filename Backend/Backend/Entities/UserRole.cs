using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class UserRole
    {
        [Key]
        public long Id { get; set; }
        public string Name { get; set; } = "";
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
