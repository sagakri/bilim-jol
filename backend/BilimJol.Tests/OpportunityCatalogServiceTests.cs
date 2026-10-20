using BilimJol.Api.Data;
using BilimJol.Api.DTOs;
using BilimJol.Api.Services;

namespace BilimJol.Tests;

public sealed class OpportunityCatalogServiceTests
{
    private readonly OpportunityCatalogService _service =
        new(new DemoOpportunityCatalogDataSource());

    [Fact]
    public async Task List_returns_explicitly_marked_demo_opportunities()
    {
        var opportunities = await _service.GetAllAsync(new OpportunityFilters());

        Assert.NotEmpty(opportunities);
        Assert.All(opportunities, opportunity => Assert.True(opportunity.IsDemo));
        Assert.Equal(opportunities.Count, opportunities.Select(item => item.Id).Distinct().Count());
    }

    [Fact]
    public async Task List_applies_search_and_all_selected_filters_together()
    {
        var opportunities = await _service.GetAllAsync(new OpportunityFilters
        {
            Search = "ПРОГРАММИРОВАНИЮ",
            Country = "Кыргызстан",
            Category = "Летняя школа",
            EducationLevel = "Школьник",
            Field = "Информатика",
            Financing = "Частичное",
            Language = "Русский",
            DeadlineBefore = new DateOnly(2026, 12, 1)
        });

        var opportunity = Assert.Single(opportunities);
        Assert.Equal("demo-programming-summer-school", opportunity.Id);
    }

    [Fact]
    public async Task List_search_is_case_insensitive_and_matches_organization()
    {
        var opportunities = await _service.GetAllAsync(new OpportunityFilters { Search = "bilimjol demo lab" });

        Assert.NotEmpty(opportunities);
        Assert.All(opportunities, item => Assert.Contains("BilimJol Demo Lab", item.Organization));
    }

    [Fact]
    public async Task Details_include_requirements_documents_and_official_link()
    {
        var opportunity = await _service.GetByIdAsync("demo-programming-summer-school");

        Assert.NotNull(opportunity);
        Assert.NotEmpty(opportunity.Requirements);
        Assert.NotEmpty(opportunity.RequiredDocuments);
        Assert.StartsWith("https://", opportunity.OfficialUrl);
        Assert.True(opportunity.IsDemo);
    }

    [Fact]
    public async Task Details_return_null_for_unknown_id()
    {
        var opportunity = await _service.GetByIdAsync("missing");

        Assert.Null(opportunity);
    }

    [Fact]
    public async Task Category_filter_matches_one_category_on_multi_category_records()
    {
        var service = new OpportunityCatalogService(new StaticDataSource([
            new OpportunityDetailsDto { Id = "multi", Title = "Multi category", Category = "Стипендия, Грант" }
        ]));

        var result = await service.GetAllAsync(new OpportunityFilters { Category = "Стипендия" });

        Assert.Single(result);
    }

    private sealed class StaticDataSource(IReadOnlyList<OpportunityDetailsDto> items) : IOpportunityCatalogDataSource
    {
        public Task<IReadOnlyList<OpportunityDetailsDto>> GetAllAsync(CancellationToken cancellationToken = default) => Task.FromResult(items);
    }
}
