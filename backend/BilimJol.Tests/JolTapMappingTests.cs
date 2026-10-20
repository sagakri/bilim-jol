using BilimJol.Api.Data;
using BilimJol.Api.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace BilimJol.Tests;

public sealed class JolTapMappingTests
{
    private static IModel CreateModel()
    {
        var options = new DbContextOptionsBuilder<JolTapDbContext>()
            .UseSqlServer("Server=localhost;Database=JolTap;Trusted_Connection=True;TrustServerCertificate=True")
            .Options;
        using var context = new JolTapDbContext(options);
        return context.Model;
    }

    [Fact]
    public void Opportunity_uses_existing_table_and_composite_key()
    {
        var entity = CreateModel().FindEntityType(typeof(Opportunity));
        Assert.NotNull(entity);
        Assert.Equal("opportunities", entity.GetTableName());
        Assert.Equal("dbo", entity.GetSchema());
        Assert.Equal(new[] { nameof(Opportunity.ProgramId), nameof(Opportunity.Intake) },
            entity.FindPrimaryKey()!.Properties.Select(property => property.Name));
        AssertColumn(entity, nameof(Opportunity.Name), "name");
        AssertColumn(entity, nameof(Opportunity.PayloadJson), "payload_json");
    }

    [Fact]
    public void Existing_child_tables_without_declared_keys_are_keyless_read_models()
    {
        var model = CreateModel();
        AssertKeyless<OpportunityCategory>(model, "opportunity_categories");
        AssertKeyless<OpportunityCountry>(model, "opportunity_countries");
        AssertKeyless<FieldEvidence>(model, "field_evidence");
    }

    [Fact]
    public void Opportunity_has_only_columns_present_in_the_snapshot()
    {
        var entity = CreateModel().FindEntityType(typeof(Opportunity))!;
        var table = StoreObjectIdentifier.Table("opportunities", "dbo");
        var mappedColumns = entity.GetProperties()
            .Select(property => property.GetColumnName(table))
            .OrderBy(column => column)
            .ToArray();

        Assert.Equal(new[]
        {
            "application_url", "deadline", "fetched_at", "intake", "name", "organizer",
            "payload_json", "program_id", "region", "review_status"
        }, mappedColumns);
    }

    [Fact]
    public void Opportunity_mapping_matches_live_sql_server_column_lengths()
    {
        var entity = CreateModel().FindEntityType(typeof(Opportunity))!;
        Assert.Equal(400, entity.FindProperty(nameof(Opportunity.ProgramId))!.GetMaxLength());
        Assert.Equal(400, entity.FindProperty(nameof(Opportunity.Intake))!.GetMaxLength());
        Assert.Equal(200, entity.FindProperty(nameof(Opportunity.Deadline))!.GetMaxLength());
        Assert.Equal(200, entity.FindProperty(nameof(Opportunity.ReviewStatus))!.GetMaxLength());
        Assert.Equal(200, entity.FindProperty(nameof(Opportunity.FetchedAt))!.GetMaxLength());

        var category = CreateModel().FindEntityType(typeof(OpportunityCategory))!;
        Assert.Equal(400, category.FindProperty(nameof(OpportunityCategory.ProgramId))!.GetMaxLength());
        Assert.Equal(400, category.FindProperty(nameof(OpportunityCategory.Intake))!.GetMaxLength());
        Assert.Equal(200, category.FindProperty(nameof(OpportunityCategory.Category))!.GetMaxLength());
    }

    [Fact]
    public void Field_evidence_mapping_matches_live_sql_server_column_lengths()
    {
        var entity = CreateModel().FindEntityType(typeof(FieldEvidence))!;
        Assert.Equal(400, entity.FindProperty(nameof(FieldEvidence.ProgramId))!.GetMaxLength());
        Assert.Equal(400, entity.FindProperty(nameof(FieldEvidence.Intake))!.GetMaxLength());
        Assert.Equal(200, entity.FindProperty(nameof(FieldEvidence.Field))!.GetMaxLength());
        Assert.Equal(200, entity.FindProperty(nameof(FieldEvidence.Status))!.GetMaxLength());
        Assert.Equal(200, entity.FindProperty(nameof(FieldEvidence.FetchedAt))!.GetMaxLength());
    }

    [Fact]
    public void Admission_tables_use_their_existing_ids_and_sql_types()
    {
        var model = CreateModel();
        AssertEntity<AdmissionInstitution>(model, "admission_institutions", nameof(AdmissionInstitution.Id));
        AssertEntity<AdmissionProgram>(model, "admission_programs", nameof(AdmissionProgram.Id));
        AssertEntity<AdmissionFact>(model, "admission_facts", nameof(AdmissionFact.Id));
        AssertEntity<AdmissionSource>(model, "admission_sources", nameof(AdmissionSource.Id));
        AssertEntity<AdmissionOpportunityLink>(model, "admission_opportunity_links", nameof(AdmissionOpportunityLink.Id));

        var fact = model.FindEntityType(typeof(AdmissionFact))!;
        Assert.Equal("int", fact.FindProperty(nameof(AdmissionFact.PageNo))!.GetColumnType());
        Assert.Equal("decimal(18,2)", fact.FindProperty(nameof(AdmissionFact.NumericValue))!.GetColumnType());
    }

    [Fact]
    public void Admission_entities_map_all_snapshot_columns()
    {
        var model = CreateModel();
        AssertColumns<AdmissionInstitution>(model, "admission_institutions", "country city id kind metadata_json name region");
        AssertColumns<AdmissionProgram>(model, "admission_programs", "academic_year code evidence_text faculty id institution_id name review_status source_id source_url version_id");
        AssertColumns<AdmissionFact>(model, "admission_facts", "academic_year currency fetched_at field id institution_id method numeric_value page_no period review_status scope_json score_kind section source_id text version_id year_status");
        AssertColumns<AdmissionSource>(model, "admission_sources", "academic_years_json content_type error fetched_at id institution_id last_attempted_at links_json raw_path source_url status text title version_id");
        AssertColumns<AdmissionOpportunityLink>(model, "admission_opportunity_links", "id institution_id intake program_id relation review_status");
    }

    private static void AssertColumns<TEntity>(IModel model, string tableName, string expectedColumns)
    {
        var entity = model.FindEntityType(typeof(TEntity))!;
        var table = StoreObjectIdentifier.Table(tableName, "dbo");
        var actual = entity.GetProperties()
            .Select(property => property.GetColumnName(table))
            .OrderBy(column => column);
        Assert.Equal(expectedColumns.Split(' ').OrderBy(column => column), actual);
    }
    private static void AssertKeyless<TEntity>(IModel model, string tableName)
    {
        var entity = model.FindEntityType(typeof(TEntity));
        Assert.NotNull(entity);
        Assert.Equal(tableName, entity.GetTableName());
        Assert.Equal("dbo", entity.GetSchema());
        Assert.Null(entity.FindPrimaryKey());
    }

    private static void AssertEntity<TEntity>(IModel model, string tableName, string keyProperty)
    {
        var entity = model.FindEntityType(typeof(TEntity));
        Assert.NotNull(entity);
        Assert.Equal(tableName, entity.GetTableName());
        Assert.Equal("dbo", entity.GetSchema());
        Assert.Equal(keyProperty, Assert.Single(entity.FindPrimaryKey()!.Properties).Name);
    }

    private static void AssertColumn(IEntityType entity, string propertyName, string columnName)
    {
        var property = entity.FindProperty(propertyName);
        Assert.NotNull(property);
        Assert.Equal(columnName, property.GetColumnName(StoreObjectIdentifier.Table(entity.GetTableName()!, entity.GetSchema())));
    }
}
