
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
	public class DataContext : DbContext
	{
		public DataContext(DbContextOptions options) : base(options)
		{
		}

        public DbSet<AppUser> Users { get; set; }
		public DbSet<UserLike> Likes { get; set; }
		public DbSet<Message> Messages { get; set; }

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);
			builder.Entity<UserLike>().HasKey(k => new { k.SourceUserId, k.LikedUserId });
			builder.Entity<UserLike>()
			.HasOne(x => x.SourceUser)
			.WithMany(x => x.LikedUsers)
			.HasForeignKey(x => x.SourceUserId)
			.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<UserLike>()
			.HasOne(x => x.LikedUser)
			.WithMany(x => x.LikedByUsers)
			.HasForeignKey(x => x.LikedUserId)
			.OnDelete(DeleteBehavior.Cascade);

			builder.Entity<Message>()
			.HasOne(x => x.Receiver)
			.WithMany(x => x.MessagesReceived)
			.OnDelete(DeleteBehavior.Restrict);

			builder.Entity<Message>()
			.HasOne(x => x.Sender)
			.WithMany(x => x.MessagesSent)
			.OnDelete(DeleteBehavior.Restrict);
		}
	}
}