using Backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : IdentityDbContext<User, IdentityRole<long>, long>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> App_User { get; set; }
    public DbSet<Community> Community { get; set; }
    public DbSet<Post> Post { get; set; }
    public DbSet<Comment> Comment { get; set; }
    public DbSet<Session> Sessions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("app_user");
            e.HasKey(u => u.Id);
            e.Property(u => u.Id).ValueGeneratedOnAdd();
        });

        // User ↔ Community (1:n)
        modelBuilder.Entity<Community>()
            .HasOne(c => c.User)
            .WithMany(u => u.Communities)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // User ↔ Post (1:n)
        modelBuilder.Entity<Post>()
            .HasOne(p => p.User)
            .WithMany(u => u.Posts)
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Community ↔ Post (1:n)
        modelBuilder.Entity<Post>()
            .HasOne(p => p.Community)
            .WithMany(c => c.Posts)
            .HasForeignKey(p => p.CommunityId)
            .OnDelete(DeleteBehavior.Cascade);

        // Post ↔ Comment (1:n)
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Post)
            .WithMany(p => p.Comments)
            .HasForeignKey(c => c.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        // User ↔ Comment (1:n)
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Community>().ToTable("community");
        modelBuilder.Entity<Post>().ToTable("post");
        modelBuilder.Entity<Comment>().ToTable("comment");
    }
}