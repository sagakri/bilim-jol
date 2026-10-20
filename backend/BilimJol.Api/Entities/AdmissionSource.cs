namespace BilimJol.Api.Entities;

public sealed class AdmissionSource
{
    public string Id { get; set; } = null!;
    public string? InstitutionId { get; set; }
    public string? SourceUrl { get; set; }
    public string? Title { get; set; }
    public string? ContentType { get; set; }
    public string? FetchedAt { get; set; }
    public string? AcademicYearsJson { get; set; }
    public string? RawPath { get; set; }
    public string? Text { get; set; }
    public string? LinksJson { get; set; }
    public string? Status { get; set; }
    public string? Error { get; set; }
    public string? LastAttemptedAt { get; set; }
    public string? VersionId { get; set; }
}
