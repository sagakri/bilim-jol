namespace BilimJol.Api.Services;

public sealed record OpportunityFilters
{
    public string? Search { get; init; }
    public string? Country { get; init; }
    public string? Category { get; init; }
    public string? EducationLevel { get; init; }
    public string? Field { get; init; }
    public string? Financing { get; init; }
    public string? Language { get; init; }
    public DateOnly? DeadlineBefore { get; init; }
}
