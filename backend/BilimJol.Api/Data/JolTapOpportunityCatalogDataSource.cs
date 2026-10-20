using Microsoft.EntityFrameworkCore;
using BilimJol.Api.DTOs;

namespace BilimJol.Api.Data;

public sealed class JolTapOpportunityCatalogDataSource(JolTapDbContext db) : IOpportunityCatalogDataSource
{
    public async Task<IReadOnlyList<OpportunityDetailsDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var opportunities = await db.Opportunities.AsNoTracking().ToListAsync(cancellationToken);
        var categories = await db.OpportunityCategories.AsNoTracking().ToListAsync(cancellationToken);
        var countries = await db.OpportunityCountries.AsNoTracking().ToListAsync(cancellationToken);

        return opportunities.Select(opportunity => JolTapOpportunityMapper.Map(
                opportunity,
                categories.Where(item => item.ProgramId == opportunity.ProgramId && item.Intake == opportunity.Intake),
                countries.Where(item => item.ProgramId == opportunity.ProgramId && item.Intake == opportunity.Intake)))
            .ToArray();
    }
}
