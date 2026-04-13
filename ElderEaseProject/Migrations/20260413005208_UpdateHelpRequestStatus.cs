using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ElderEaseProject.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHelpRequestStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "HelpRequests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "HelpRequests");
        }
    }
}
