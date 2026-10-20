using System.Globalization;
using System.Text.Json;
using BilimJol.Api.DTOs;
using BilimJol.Api.Entities;

namespace BilimJol.Api.Data;

public static class JolTapOpportunityMapper
{
    private static readonly IReadOnlyDictionary<string, string> Categories = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        ["scholarship"] = "Стипендия",
        ["grant"] = "Грант",
        ["exchange"] = "Обмен",
        ["internship"] = "Стажировка",
        ["ferienjob"] = "Летняя работа",
        ["ausbildung"] = "Профессиональное обучение"
    };

    private static readonly IReadOnlyDictionary<string, string> Countries = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        ["DE"] = "Германия",
        ["GB"] = "Великобритания",
        ["HU"] = "Венгрия",
        ["JP"] = "Япония",
        ["RO"] = "Румыния",
        ["TR"] = "Турция",
        ["MULTI"] = "Несколько стран"
    };

    public static OpportunityDetailsDto Map(
        Opportunity source,
        IEnumerable<OpportunityCategory> categories,
        IEnumerable<OpportunityCountry> countries)
    {
        using var payload = ParsePayload(source.PayloadJson);
        var root = payload?.RootElement;
        var identity = root is { } value ? value : default;
        var category = categories.Select(item => Localize(item.Category, Categories)).Distinct().ToArray();
        var country = countries.Select(item => Localize(item.Country, Countries)).Distinct().ToArray();
        var isVerified = source.ReviewStatus is "verified" or "approved";
        var sourceUrl = StringArray(identity, "source_urls").FirstOrDefault();
        var requirementEvidence = ApprovedEvidence(identity, "requirements");
        var requiredDocumentEvidence = ApprovedEvidence(identity, "documents");

        return new OpportunityDetailsDto
        {
            Id = $"{source.ProgramId}::{source.Intake}",
            Title = source.Name ?? "Название не указано",
            Organization = source.Organizer ?? "Организатор не указан",
            Description = String(identity, "official_basis") ?? String(identity, "description") ?? "Описание в источнике не указано.",
            Country = country.Length == 0 ? "Не указана" : string.Join(", ", country),
            Category = category.Length == 0 ? "Не указана" : string.Join(", ", category),
            Field = FirstString(identity, "field_of_study", "field") ?? "Не указано",
            EducationLevel = FirstString(identity, "education_level", "educationLevel") ?? "Не указано",
            Financing = FirstString(identity, "financing", "funding_type") ?? "Не указано",
            Deadline = DateOnly.TryParse(source.Deadline, CultureInfo.InvariantCulture, DateTimeStyles.None, out var deadline) ? deadline : null,
            Language = FirstString(identity, "language", "instruction_language") ?? "Не указано",
            MinimumLanguageLevel = FirstString(identity, "minimum_language_level", "minimumLanguageLevel"),
            MinimumGpa = FirstString(identity, "minimum_gpa", "minimumGpa"),
            MinimumCourse = Integer(identity, "minimum_course") ?? Integer(identity, "minimumCourse"),
            OfficialUrl = source.ApplicationUrl ?? sourceUrl ?? string.Empty,
            IsVerified = isVerified,
            IsDemo = false,
            VerificationStatus = isVerified ? "Проверено" : source.ReviewStatus == "needs_review" ? "Требует проверки" : "Не подтверждено",
            Requirements = requirementEvidence.Select(item => item.Text).ToArray(),
            RequiredDocuments = requiredDocumentEvidence.Select(item => item.Text).ToArray(),
            RequirementEvidence = requirementEvidence,
            RequiredDocumentEvidence = requiredDocumentEvidence
        };
    }

    private static JsonDocument? ParsePayload(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        try { return JsonDocument.Parse(json); }
        catch (JsonException) { return null; }
    }

    private static string Localize(string? value, IReadOnlyDictionary<string, string> translations)
    {
        if (string.IsNullOrWhiteSpace(value)) return "Не указано";
        return translations.TryGetValue(value, out var translated) ? translated : value;
    }

    private static string? String(JsonElement root, string name) =>
        root.ValueKind == JsonValueKind.Object && root.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()
            : null;

    private static string? FirstString(JsonElement root, params string[] names)
    {
        foreach (var name in names)
            if (String(root, name) is { Length: > 0 } value) return value;
        return null;
    }

    private static int? Integer(JsonElement root, string name) =>
        root.ValueKind == JsonValueKind.Object && root.TryGetProperty(name, out var value) && value.TryGetInt32(out var number)
            ? number
            : null;

    private static IReadOnlyList<string> StringArray(JsonElement root, string name) =>
        root.ValueKind == JsonValueKind.Object && root.TryGetProperty(name, out var value) && value.ValueKind == JsonValueKind.Array
            ? value.EnumerateArray().Where(item => item.ValueKind == JsonValueKind.String).Select(item => item.GetString()!).ToArray()
            : [];

    private static IReadOnlyList<OpportunityEvidenceDto> ApprovedEvidence(JsonElement root, string section)
    {
        if (root.ValueKind != JsonValueKind.Object || !root.TryGetProperty("fields", out var fields) ||
            fields.ValueKind != JsonValueKind.Object || !fields.TryGetProperty(section, out var entries) ||
            entries.ValueKind != JsonValueKind.Array) return [];

        return entries.EnumerateArray()
            .Where(item => String(item, "status") is { } status &&
                (status.Equals("verified", StringComparison.OrdinalIgnoreCase) ||
                 status.Equals("approved", StringComparison.OrdinalIgnoreCase)))
            .Select(item => new OpportunityEvidenceDto
            {
                Text = String(item, "text") ?? string.Empty,
                SourceUrl = HttpUrl(String(item, "source_url")),
                Section = String(item, "section"),
                FetchedAt = String(item, "fetched_at")
            })
            .Where(item => !string.IsNullOrWhiteSpace(item.Text))
            .DistinctBy(item => (item.Text, item.SourceUrl, item.Section))
            .ToArray();
    }

    private static string? HttpUrl(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out var uri) &&
        (uri.Scheme == Uri.UriSchemeHttps || uri.Scheme == Uri.UriSchemeHttp)
            ? uri.AbsoluteUri
            : null;
}
