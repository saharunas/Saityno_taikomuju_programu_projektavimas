using Backend.Entities;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> App_User { get; set; }
    public DbSet<Community> Community { get; set; }
    public DbSet<Post> Post { get; set; }
    public DbSet<Comment> Comment { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserRole>().ToTable("user_role");
        modelBuilder.Entity<User>().ToTable("app_user");

        modelBuilder.Entity<UserRole>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.Name).HasMaxLength(50).IsRequired();
            e.HasIndex(r => r.Name).IsUnique();
            e.HasData(
                new UserRole { Id = 1, Name = "Admin" },
                new UserRole { Id = 2, Name = "Moderator" },
                new UserRole { Id = 3, Name = "Member" }
            );
        });

        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasOne(u => u.Role)
             .WithMany(r => r.Users)
             .HasForeignKey(u => u.RoleId)
             .OnDelete(DeleteBehavior.Restrict);
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

        modelBuilder.Entity<User>().ToTable("app_user");
        modelBuilder.Entity<Community>().ToTable("community");
        modelBuilder.Entity<Post>().ToTable("post");
        modelBuilder.Entity<Comment>().ToTable("comment");


        modelBuilder.Entity<User>().HasData(
        new User
        {
            Id = 1,
            Name = "Admin",
            Surname = "User",
            Username = "admin",
            Email = "admin@example.com",
            Password = "adminpassword",
            RoleId = 1
        },
        new User
        {
            Id = 2,
            Name = "Saras",
            Surname = "saras",
            Username = "saras",
            Email = "saras@example.com",
            Password = "saras",
            RoleId = 2
        },
        new User
        {
            Id = 3,
            Name = "user1",
            Surname = "user1",
            Username = "user1",
            Email = "user1@example.com",
            Password = "user1",
            RoleId = 2
        });

        modelBuilder.Entity<Community>().HasData(
        new Community
        {
            Id = 1,
            Name = "TechTalks",
            Description = "Community for tech enthusiasts",
            CreationDate = new DateTime(2025, 01, 01, 0, 0, 0, DateTimeKind.Utc),
            UserId = 1
        }, 
        new Community
        {
            Id = 2,
            Name = "AntrasCommunity",
            Description = "Community for antiem zmonem",
            CreationDate = new DateTime(2025, 07, 01, 0, 0, 0, DateTimeKind.Utc),
            UserId = 2
        });

        modelBuilder.Entity<Post>().HasData(
        new Post
        {
            Id = 1,
            Title = "Welcome!",
            Text = "First post 🎉",
            CreationDate = new DateTime(2025, 01, 02, 0, 0, 0, DateTimeKind.Utc),
            UserId = 1,
            CommunityId = 1
        },
        new Post
        {
            Id = 2,
            Title = "Second!",
            Text = "SecondPost",
            CreationDate = new DateTime(2025, 01, 02, 0, 0, 0, DateTimeKind.Utc),
            UserId = 2,
            CommunityId = 1
        },
        new Post
        {
            Id = 3,
            Title = "Third!",
            Text = "ThirdPost",
            CreationDate = new DateTime(2025, 01, 02, 0, 0, 0, DateTimeKind.Utc),
            UserId = 2,
            CommunityId = 2
        },
        new Post
        {
            Id = 4,
            Title = "Third!",
            Text = "ThirdPost",
            CreationDate = new DateTime(2025, 01, 02, 0, 0, 0, DateTimeKind.Utc),
            UserId = 2,
            CommunityId = 1
        });

        modelBuilder.Entity<Comment>().HasData(
        new Comment
        {
            Id = 1,
            Text = "Glad to be here!",
            UserId = 2,
            PostId = 1
        },
        new Comment
        {
            Id = 2,
            Text = "me too!",
            UserId = 1,
            PostId = 1
        },
        new Comment
        {
            Id = 3,
            Text = "Yippee!",
            UserId = 3,
            PostId = 1
        },
        new Comment
        {
            Id = 4,
            Text = "Cool",
            UserId = 1,
            PostId = 2
        },
        new Comment
        {
            Id = 5,
            Text = "as sakau",
            UserId = 3,
            PostId = 2
        },
        new Comment
        {
            Id = 6,
            Text = "neidomu",
            UserId = 1,
            PostId = 3
        }
    );
    }
}