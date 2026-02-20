using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkillTrail.Migrations.SQLite.Migrations
{
    /// <inheritdoc />
    public partial class Add_Feedback : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ExperiencePoints",
                table: "Users",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "Level",
                table: "Tasks",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Feedbacks",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    Comment = table.Column<string>(type: "TEXT", nullable: false),
                    UpdateDateTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdateUserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Feedbacks", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "manager",
                column: "ExperiencePoints",
                value: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Feedbacks");

            migrationBuilder.DropColumn(
                name: "ExperiencePoints",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "Tasks");
        }
    }
}
