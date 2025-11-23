namespace Backend.Entities
{
    public class UserRegisterDTO
    {
        public string name { get; set; } = null!;
        public string surname { get; set; } = null!;
        public string username { get; set; } = null!;
        public string email { get; set; } = null!;
        public string password { get; set; } = null!;
    }
    public class UserLoginDTO
    {
        public string username { get; set; } = null!;
        public string password { get; set; } = null!;
    }

    public class UserResponseDTO
    {
        public long id { get; set; }
        public string name { get; set; } = null!;
        public string surname { get; set; } = null!;
        public string username { get; set; } = null!;
        public string email { get; set; } = null!;
    }
}
