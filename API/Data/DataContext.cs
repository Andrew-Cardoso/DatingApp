using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data
{
    public class
    DataContext
    :
    IdentityDbContext<AppUser,
        AppRole,
        int,
        IdentityUserClaim<int>,
        AppUserRole,
        IdentityUserLogin<int>,
        IdentityRoleClaim<int>,
        IdentityUserToken<int>
    >
    {
        public DataContext(DbContextOptions options) :
            base(options)
        {
        }

        public DbSet<UserLike> Likes { get; set; }

        public DbSet<Message> Messages { get; set; }

        public DbSet<Group> Groups { get; set; }

        public DbSet<Connection> Connections { get; set; }
        public DbSet<Photo> Photos { get; set; }

		protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder
                .Entity<AppUser>()
                .HasMany(x => x.UserRoles)
                .WithOne(x => x.User)
                .HasForeignKey(x => x.UserId)
                .IsRequired();

            builder
                .Entity<AppRole>()
                .HasMany(x => x.UserRoles)
                .WithOne(x => x.Role)
                .HasForeignKey(x => x.RoleId)
                .IsRequired();

            builder
                .Entity<UserLike>()
                .HasKey(k => new { k.SourceUserId, k.LikedUserId });
            builder
                .Entity<UserLike>()
                .HasOne(x => x.SourceUser)
                .WithMany(x => x.LikedUsers)
                .HasForeignKey(x => x.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<UserLike>()
                .HasOne(x => x.LikedUser)
                .WithMany(x => x.LikedByUsers)
                .HasForeignKey(x => x.LikedUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<Message>()
                .HasOne(x => x.Receiver)
                .WithMany(x => x.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<Message>()
                .HasOne(x => x.Sender)
                .WithMany(x => x.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Photo>().HasQueryFilter(p => p.IsApproved);

			builder.ApplyUtcDateTimeConverter();
		}
    }
	// Converting all DateTime to UTC
    public static class UtcDateAnnotation
    {
        private const String IsUtcAnnotation = "IsUtc";
        private static readonly ValueConverter<DateTime, DateTime> UtcConverter = new ValueConverter<DateTime, DateTime>(v => v, v => DateTime.SpecifyKind(v, DateTimeKind.Utc));
        private static readonly ValueConverter<DateTime?, DateTime?> UtcNullableConverter = new ValueConverter<DateTime?, DateTime?>(v => v, v => v == null ? v : DateTime.SpecifyKind(v.Value, DateTimeKind.Utc));
        public static PropertyBuilder<TProperty> IsUtc<TProperty>(this PropertyBuilder<TProperty> builder,Boolean isUtc = true) => builder.HasAnnotation(IsUtcAnnotation, isUtc);
        public static Boolean IsUtc(this IMutableProperty property) => ((Boolean?) property.FindAnnotation(IsUtcAnnotation)?.Value) ?? true;

        /// <summary>
        /// Make sure this is called after configuring all your entities.
        /// </summary>
        public static void ApplyUtcDateTimeConverter(this ModelBuilder builder)
        {
            foreach (var entityType in builder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    if (!property.IsUtc()) continue;
                    if (property.ClrType == typeof (DateTime)) property.SetValueConverter (UtcConverter); 
                    if (property.ClrType == typeof (DateTime?)) property.SetValueConverter (UtcNullableConverter);
                }
            }
        }
    }
}
