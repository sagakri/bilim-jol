using BilimJol.Api.Data;
using BilimJol.Api.DTOs;

namespace BilimJol.Api.Services;

public sealed class OpportunityCatalogService(IOpportunityCatalogDataSource dataSource)
{
    public async Task<IReadOnlyList<OpportunityCardDto>> GetAllAsync(
        OpportunityFilters filters,
        CancellationToken cancellationToken = default)
    {
        var items = await dataSource.GetAllAsync(cancellationToken);
        IEnumerable<OpportunityDetailsDto> query = items;

        query = ApplySearch(query, filters.Search);
        query = ApplyExactFilter(query, filters.Country, item => item.Country);
        query = ApplyCategoryFilter(query, filters.Category);
        query = ApplyExactFilter(query, filters.EducationLevel, item => item.EducationLevel);
        query = ApplyExactFilter(query, filters.Field, item => item.Field);
        query = ApplyExactFilter(query, filters.Financing, item => item.Financing);
        query = ApplyExactFilter(query, filters.Language, item => item.Language);

        if (filters.DeadlineBefore is { } deadlineBefore)
        {
            query = query.Where(item => item.Deadline is { } deadline && deadline <= deadlineBefore);
        }

        return query
            .OrderBy(item => item.Deadline is null)
            .ThenBy(item => item.Deadline)
            .ThenBy(item => item.Title, StringComparer.CurrentCulture)
            .Select(ToCard)
            .ToArray();
    }

    public async Task<OpportunityDetailsDto?> GetByIdAsync(
        string id,
        CancellationToken cancellationToken = default)
    {
        var items = await dataSource.GetAllAsync(cancellationToken);
        return items.FirstOrDefault(item => string.Equals(item.Id, id, StringComparison.OrdinalIgnoreCase));
    }

    private static IEnumerable<OpportunityDetailsDto> ApplySearch(
        IEnumerable<OpportunityDetailsDto> items,
        string? search)
    {
        if (string.IsNullOrWhiteSpace(search))
        {
            return items;
        }

        return items.Where(item =>
            Contains(item.Title, search) ||
            Contains(item.Organization, search) ||
            Contains(item.Description, search) ||
            Contains(item.Country, search) ||
            Contains(item.Field, search) ||
            Contains(item.Category, search));
    }

    private static IEnumerable<OpportunityDetailsDto> ApplyExactFilter(
        IEnumerable<OpportunityDetailsDto> items,
        string? filter,
        Func<OpportunityDetailsDto, string> selector)
    {
        if (string.IsNullOrWhiteSpace(filter))
        {
            return items;
        }

        return items.Where(item => string.Equals(selector(item), filter.Trim(), StringComparison.OrdinalIgnoreCase));
    }

    private static IEnumerable<OpportunityDetailsDto> ApplyCategoryFilter(
        IEnumerable<OpportunityDetailsDto> items,
        string? category)
    {
        if (string.IsNullOrWhiteSpace(category)) return items;
        return items.Where(item => item.Category
            .Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries)
            .Contains(category.Trim(), StringComparer.OrdinalIgnoreCase));
    }

    private static bool Contains(string value, string search) =>
        value.Contains(search.Trim(), StringComparison.OrdinalIgnoreCase);

    private static OpportunityCardDto ToCard(OpportunityDetailsDto item) => new()
    {
        Id = item.Id,
        Title = item.Title,
        Organization = item.Organization,
        Description = item.Description,
        Country = item.Country,
        Category = item.Category,
        Field = item.Field,
        EducationLevel = item.EducationLevel,
        Financing = item.Financing,
        Deadline = item.Deadline,
        Language = item.Language,
        MinimumLanguageLevel = item.MinimumLanguageLevel,
        MinimumGpa = item.MinimumGpa,
        MinimumCourse = item.MinimumCourse,
        OfficialUrl = item.OfficialUrl,
        IsVerified = item.IsVerified,
        IsDemo = item.IsDemo,
        VerificationStatus = item.VerificationStatus
    };
}
