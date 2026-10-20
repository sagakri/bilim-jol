using BilimJol.Api.DTOs;

namespace BilimJol.Api.Data;

public interface IOpportunityCatalogDataSource
{
    Task<IReadOnlyList<OpportunityDetailsDto>> GetAllAsync(CancellationToken cancellationToken = default);
}
