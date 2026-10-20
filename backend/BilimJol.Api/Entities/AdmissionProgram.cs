namespace BilimJol.Api.Entities;

public sealed class AdmissionProgram
{
    public string Id { get; set; } = null!;
    public string? InstitutionId { get; set; }
    public string? Code { get; set; }
    public string? Name { get; set; }
    public string? Faculty { get; set; }
    public string? AcademicYear { get; set; }
    public string? SourceUrl { get; set; }
    public string? EvidenceText { get; set; }
    public string? ReviewStatus { get; set; }
    public string? SourceId { get; set; }
    public string? VersionId { get; set; }
}
