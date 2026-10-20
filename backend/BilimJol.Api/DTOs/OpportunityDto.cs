namespace BilimJol.Api.DTOs;

public record OpportunityCardDto
{
    public string Id { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Organization { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Country { get; init; } = string.Empty;
    public string Category { get; init; } = string.Empty;
    public string Field { get; init; } = string.Empty;
    public string EducationLevel { get; init; } = string.Empty;
    public string Financing { get; init; } = string.Empty;
    public DateOnly? Deadline { get; init; }
    public string Language { get; init; } = string.Empty;
    public string? MinimumLanguageLevel { get; init; }
    public string? MinimumGpa { get; init; }
    public int? MinimumCourse { get; init; }
    public string OfficialUrl { get; init; } = string.Empty;
    public bool IsVerified { get; init; }
    public bool IsDemo { get; init; }
    public string VerificationStatus { get; init; } = "Не проверено";
}

public sealed record OpportunityDetailsDto : OpportunityCardDto
{
    public IReadOnlyList<string> Requirements { get; init; } = [];
    public IReadOnlyList<string> RequiredDocuments { get; init; } = [];
    public IReadOnlyList<OpportunityEvidenceDto> RequirementEvidence { get; init; } = [];
    public IReadOnlyList<OpportunityEvidenceDto> RequiredDocumentEvidence { get; init; } = [];
}

public sealed record OpportunityEvidenceDto
{
    public string Text { get; init; } = string.Empty;
    public string? SourceUrl { get; init; }
    public string? Section { get; init; }
    public string? FetchedAt { get; init; }
}
