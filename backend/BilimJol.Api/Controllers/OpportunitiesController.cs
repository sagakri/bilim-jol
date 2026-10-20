using BilimJol.Api.DTOs;
using BilimJol.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BilimJol.Api.Controllers;

[ApiController]
[Route("api/opportunities")]
public sealed class OpportunitiesController(OpportunityCatalogService catalog) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<OpportunityCardDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<OpportunityCardDto>>> GetAll(
        [FromQuery(Name = "q")] string? search,
        [FromQuery] string? country,
        [FromQuery] string? category,
        [FromQuery] string? educationLevel,
        [FromQuery] string? field,
        [FromQuery] string? financing,
        [FromQuery] string? language,
        [FromQuery] DateOnly? deadlineBefore,
        CancellationToken cancellationToken)
    {
        var result = await catalog.GetAllAsync(new OpportunityFilters
        {
            Search = search,
            Country = country,
            Category = category,
            EducationLevel = educationLevel,
            Field = field,
            Financing = financing,
            Language = language,
            DeadlineBefore = deadlineBefore
        }, cancellationToken);

        return Ok(result);
    }

    [HttpGet("{id}")]
    [ProducesResponseType<OpportunityDetailsDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OpportunityDetailsDto>> GetById(string id, CancellationToken cancellationToken)
    {
        var opportunity = await catalog.GetByIdAsync(id, cancellationToken);
        return opportunity is null
            ? NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Программа не найдена",
                Detail = $"Возможность с идентификатором '{id}' отсутствует в каталоге."
            })
            : Ok(opportunity);
    }
}
