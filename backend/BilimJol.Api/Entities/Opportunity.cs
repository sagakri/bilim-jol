namespace BilimJol.Api.Entities;

public sealed class Opportunity
{
    public string ProgramId { get; set; } = null!;
    public string Intake { get; set; } = null!;
    public string? Name { get; set; }
    public string? Organizer { get; set; }
    public string? Region { get; set; }
    public string? Deadline { get; set; }
    public string? ApplicationUrl { get; set; }
    public string? ReviewStatus { get; set; }
    public string? FetchedAt { get; set; }
    public string? PayloadJson { get; set; }
}
