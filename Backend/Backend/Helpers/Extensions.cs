using System.Security.Cryptography;
using System.Text;

namespace Backend.Helpers
{
    public static class Extensions
    {
        public static string ToSHA256(this string str)
        {
            using var sha256 = SHA256.Create();
            byte[] bytes = Encoding.UTF8.GetBytes(str);
            byte[] hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }
}
