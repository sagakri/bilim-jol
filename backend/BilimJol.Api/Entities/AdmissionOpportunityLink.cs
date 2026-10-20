namespace BilimJol.Api.Entities;

public sealed class AdmissionOpportunityLink
{
    public string Id { get; set; } = null!;
    public string? InstitutionId { get; set; }
    public string? ProgramId { get; set; }
    public string? Intake { get; set; }
    public string? Relation { get; set; }
    public string? ReviewStatus { get; set; }
}
