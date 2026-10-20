namespace BilimJol.Api.Entities;

public sealed class AdmissionFact
{
    public string Id { get; set; } = null!;
    public string? InstitutionId { get; set; }
    public string? SourceId { get; set; }
    public string? Field { get; set; }
    public string? Text { get; set; }
    public string? Section { get; set; }
    public int? PageNo { get; set; }
    public string? AcademicYear { get; set; }
    public string? YearStatus { get; set; }
    public decimal? NumericValue { get; set; }
    public string? Currency { get; set; }
    public string? Period { get; set; }
    public string? ScoreKind { get; set; }
    public string? ScopeJson { get; set; }
    public string? Method { get; set; }
    public string? ReviewStatus { get; set; }
    public string? FetchedAt { get; set; }
    public string? VersionId { get; set; }
}
