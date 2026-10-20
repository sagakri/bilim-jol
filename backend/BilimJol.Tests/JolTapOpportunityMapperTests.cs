using BilimJol.Api.Data;
using BilimJol.Api.Entities;

namespace BilimJol.Tests;

public sealed class JolTapOpportunityMapperTests
{
    private static Opportunity Source(string reviewStatus = "needs_review", string? applicationUrl = null) => new()
    {
        ProgramId = "test-scholarship",
        Intake = "2027",
        Name = "Test award",
        Organizer = "Test Foundation",
        Region = "international",
        Deadline = null,
        ApplicationUrl = applicationUrl,
        ReviewStatus = reviewStatus,
        PayloadJson = """
            {
              "official_basis":"Official source summary.",
              "source_urls":["https://example.edu/program"],
              "verified_at":null,
              "fields":{
                "requirements":[
                  {"status":"candidate","text":"Unverified requirement"},
                  {"status":"verified","text":"Confirmed requirement"}
                ],
                "documents":[{"status":"candidate","text":"Unverified document"}]
              }
            }
            """
    };

    [Fact]
    public void Maps_database_identity_categories_country_and_source_without_demo_flags()
    {
        var result = JolTapOpportunityMapper.Map(
            Source(),
            [new OpportunityCategory { ProgramId = "test-scholarship", Intake = "2027", Category = "scholarship" }],
            [new OpportunityCountry { ProgramId = "test-scholarship", Intake = "2027", Country = "DE" }]);

        Assert.Equal("test-scholarship::2027", result.Id);
        Assert.Equal("Test award", result.Title);
        Assert.Equal("Стипендия", result.Category);
        Assert.Equal("Германия", result.Country);
        Assert.Equal("Official source summary.", result.Description);
        Assert.Equal("https://example.edu/program", result.OfficialUrl);
        Assert.False(result.IsDemo);
        Assert.False(result.IsVerified);
        Assert.Equal("Требует проверки", result.VerificationStatus);
    }

    [Fact]
    public void Only_verified_evidence_is_returned_as_requirements_or_documents()
    {
        var result = JolTapOpportunityMapper.Map(Source("verified"), [], []);

        Assert.Equal(["Confirmed requirement"], result.Requirements);
        Assert.Empty(result.RequiredDocuments);
        Assert.True(result.IsVerified);
    }

    [Fact]
    public void Does_not_invent_missing_fields_and_uses_application_url_when_available()
    {
        var result = JolTapOpportunityMapper.Map(Source(applicationUrl: "https://apply.example.edu"), [], []);

        Assert.Equal("Не указано", result.Field);
        Assert.Equal("Не указано", result.EducationLevel);
        Assert.Equal("Не указано", result.Financing);
        Assert.Equal("Не указано", result.Language);
        Assert.Null(result.Deadline);
        Assert.Equal("https://apply.example.edu", result.OfficialUrl);
    }

    [Fact]
    public void Maps_program_fields_and_preserves_sources_for_verified_requirements_and_documents()
    {
        var source = Source("verified");
        source.Deadline = "2027-04-15";
        source.PayloadJson = """
            {
              "education_level":"Магистратура",
              "field_of_study":"Инженерия",
              "financing":"Полное финансирование",
              "language":"Английский",
              "minimum_language_level":"B2",
              "source_urls":["https://example.edu/program"],
              "fields":{
                "requirements":[
                  {"status":"verified","text":"Подтверждённое требование","source_url":"https://example.edu/requirements","section":"Eligibility","fetched_at":"2026-10-18T10:00:00Z"},
                  {"status":"candidate","text":"Непроверенное требование","source_url":"https://example.edu/candidate"}
                ],
                "documents":[
                  {"status":"approved","text":"Подтверждённый документ","source_url":"https://example.edu/documents","section":"Application documents","fetched_at":"2026-10-18T10:05:00Z"}
                ]
              }
            }
            """;

        var result = JolTapOpportunityMapper.Map(source, [], []);

        Assert.Equal("Магистратура", result.EducationLevel);
        Assert.Equal("Инженерия", result.Field);
        Assert.Equal("Полное финансирование", result.Financing);
        Assert.Equal("Английский", result.Language);
        Assert.Equal("B2", result.MinimumLanguageLevel);
        Assert.Equal(new DateOnly(2027, 4, 15), result.Deadline);
        Assert.Single(result.RequirementEvidence);
        Assert.Equal("Подтверждённое требование", result.RequirementEvidence[0].Text);
        Assert.Equal("https://example.edu/requirements", result.RequirementEvidence[0].SourceUrl);
        Assert.Equal("Eligibility", result.RequirementEvidence[0].Section);
        Assert.Equal("2026-10-18T10:00:00Z", result.RequirementEvidence[0].FetchedAt);
        Assert.Single(result.RequiredDocumentEvidence);
        Assert.Equal("Подтверждённый документ", result.RequiredDocumentEvidence[0].Text);
        Assert.Equal("https://example.edu/documents", result.RequiredDocumentEvidence[0].SourceUrl);
        Assert.Equal("Application documents", result.RequiredDocumentEvidence[0].Section);
    }
}
