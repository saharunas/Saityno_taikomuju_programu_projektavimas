using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public class Session
    {
        public Guid Id { get; set; }
        public string LastRefreshToken { get; set; }
        public DateTimeOffset InitiatedAt { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }

        [Required]
        public required long UserId { get; set; }
        public User User { get; set; }
    }
}
