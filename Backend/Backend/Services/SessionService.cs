using Backend.Entities;
using Backend.Helpers;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class SessionService
    {
        private readonly AppDbContext _context;

        public SessionService(AppDbContext context)
        {
            _context = context;
        }

        public async Task CreateSessionAsync(Guid sessionId, long userId, string refreshToken, DateTime expiresAt)
        {
            var session = new Session
            {
                Id = sessionId,
                UserId = userId,
                InitiatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = expiresAt,
                LastRefreshToken = refreshToken.ToSHA256()
            };
            _context.Sessions.Add(session);
            await _context.SaveChangesAsync();
        }

        public async Task ExtendSessionAsync(Guid sessionId, string refreshToken, DateTime expiresAt)
        {
            var session = await _context.Sessions.FindAsync(sessionId);
            session.ExpiresAt = expiresAt;
            session.LastRefreshToken = refreshToken.ToSHA256();

            await _context.SaveChangesAsync();
        }

        public async Task InvalidateSessionAsync(Guid sessionId)
        {
            var session = await _context.Sessions.FindAsync(sessionId);
            if (session is null)
            {
                return;
            }
            session.IsRevoked = true;

            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsSessionValidAsync(Guid sessionId, string refreshToken)
        {
            var session = await _context.Sessions.FindAsync(sessionId);
            return session is not null && session.ExpiresAt > DateTimeOffset.UtcNow && !session.IsRevoked && session.LastRefreshToken == refreshToken.ToSHA256();
        }
    }
}
