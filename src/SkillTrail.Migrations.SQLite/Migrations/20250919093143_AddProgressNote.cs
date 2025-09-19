using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SkillTrail.Migrations.SQLite.Migrations
{
    /// <inheritdoc />
    public partial class AddProgressNote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Progresses",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "Progresses");
        }
    }
}
