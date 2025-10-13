using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "app_user",
                columns: new[] { "Id", "Blocked", "Email", "Name", "Password", "RoleId", "Surname", "Username" },
                values: new object[,]
                {
                    { 1L, false, "admin@example.com", "Admin", "adminpassword", 1L, "User", "admin" },
                    { 2L, false, "saras@example.com", "Saras", "saras", 2L, "saras", "saras" },
                    { 3L, false, "user1@example.com", "user1", "user1", 2L, "user1", "user1" }
                });

            migrationBuilder.InsertData(
                table: "community",
                columns: new[] { "Id", "CreationDate", "Description", "Name", "UserId" },
                values: new object[,]
                {
                    { 1L, new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Community for tech enthusiasts", "TechTalks", 1L },
                    { 2L, new DateTime(2025, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Community for antiem zmonem", "AntrasCommunity", 2L }
                });

            migrationBuilder.InsertData(
                table: "post",
                columns: new[] { "Id", "CommunityId", "CreationDate", "Text", "Title", "UserId" },
                values: new object[,]
                {
                    { 1L, 1L, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "First post 🎉", "Welcome!", 1L },
                    { 2L, 1L, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "SecondPost", "Second!", 2L },
                    { 3L, 2L, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "ThirdPost", "Third!", 2L },
                    { 4L, 1L, new DateTime(2025, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "ThirdPost", "Third!", 2L }
                });

            migrationBuilder.InsertData(
                table: "comment",
                columns: new[] { "Id", "CreationDate", "EditedDate", "PostId", "Text", "UserId" },
                values: new object[,]
                {
                    { 1L, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 1L, "Glad to be here!", 2L },
                    { 2L, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 1L, "me too!", 1L },
                    { 3L, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 1L, "Yippee!", 3L },
                    { 4L, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 2L, "Cool", 1L },
                    { 5L, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 2L, "as sakau", 3L },
                    { 6L, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 3L, "neidomu", 1L }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "comment",
                keyColumn: "Id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "comment",
                keyColumn: "Id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "comment",
                keyColumn: "Id",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "comment",
                keyColumn: "Id",
                keyValue: 4L);

            migrationBuilder.DeleteData(
                table: "comment",
                keyColumn: "Id",
                keyValue: 5L);

            migrationBuilder.DeleteData(
                table: "comment",
                keyColumn: "Id",
                keyValue: 6L);

            migrationBuilder.DeleteData(
                table: "post",
                keyColumn: "Id",
                keyValue: 4L);

            migrationBuilder.DeleteData(
                table: "app_user",
                keyColumn: "Id",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "post",
                keyColumn: "Id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "post",
                keyColumn: "Id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "post",
                keyColumn: "Id",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "community",
                keyColumn: "Id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "community",
                keyColumn: "Id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "app_user",
                keyColumn: "Id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "app_user",
                keyColumn: "Id",
                keyValue: 2L);
        }
    }
}
