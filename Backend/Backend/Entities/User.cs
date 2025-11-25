using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class User : IdentityUser<long>
    {
        public string Name { get; set; } = "";
        public string Surname { get; set; } = "";
        public bool Blocked { get; set; } = false;

        public ICollection<Community> Communities { get; set; } = new List<Community>();
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();

        public UserResponseDTO toDto()
        {
            return new UserResponseDTO
            {
                id = this.Id,
                name = this.Name,
                surname = this.Surname,
                username = this.UserName,
                email = this.Email
            };
        }
    }
}
