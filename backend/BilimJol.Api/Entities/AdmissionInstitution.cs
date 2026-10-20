namespace BilimJol.Api.Entities;

public sealed class AdmissionInstitution
{
    public string Id { get; set; } = null!;
    public string? Name { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Region { get; set; }
    public string? Kind { get; set; }
    public string? MetadataJson { get; set; }
}
