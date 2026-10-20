using BilimJol.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace BilimJol.Api.Data;

public sealed class JolTapDbContext(DbContextOptions<JolTapDbContext> options) : DbContext(options)
{
    public DbSet<Opportunity> Opportunities => Set<Opportunity>();
    public DbSet<OpportunityCategory> OpportunityCategories => Set<OpportunityCategory>();
    public DbSet<OpportunityCountry> OpportunityCountries => Set<OpportunityCountry>();
    public DbSet<FieldEvidence> FieldEvidence => Set<FieldEvidence>();
    public DbSet<AdmissionInstitution> AdmissionInstitutions => Set<AdmissionInstitution>();
    public DbSet<AdmissionProgram> AdmissionPrograms => Set<AdmissionProgram>();
    public DbSet<AdmissionFact> AdmissionFacts => Set<AdmissionFact>();
    public DbSet<AdmissionSource> AdmissionSources => Set<AdmissionSource>();
    public DbSet<AdmissionOpportunityLink> AdmissionOpportunityLinks => Set<AdmissionOpportunityLink>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Opportunity>(entity =>
        {
            entity.ToTable("opportunities", "dbo");
            entity.HasKey(item => new { item.ProgramId, item.Intake });
            entity.Property(item => item.ProgramId).HasColumnName("program_id").HasMaxLength(400).IsRequired();
            entity.Property(item => item.Intake).HasColumnName("intake").HasMaxLength(400).IsRequired();
            entity.Property(item => item.Name).HasColumnName("name");
            entity.Property(item => item.Organizer).HasColumnName("organizer");
            entity.Property(item => item.Region).HasColumnName("region").HasColumnType("varchar(20)");
            entity.Property(item => item.Deadline).HasColumnName("deadline").HasMaxLength(200);
            entity.Property(item => item.ApplicationUrl).HasColumnName("application_url");
            entity.Property(item => item.ReviewStatus).HasColumnName("review_status").HasMaxLength(200);
            entity.Property(item => item.FetchedAt).HasColumnName("fetched_at").HasMaxLength(200);
            entity.Property(item => item.PayloadJson).HasColumnName("payload_json");
        });

        ConfigureKeyless<OpportunityCategory>(modelBuilder, "opportunity_categories");
        modelBuilder.Entity<OpportunityCategory>(entity =>
        {
            entity.Property(item => item.ProgramId).HasColumnName("program_id").HasMaxLength(400);
            entity.Property(item => item.Intake).HasColumnName("intake").HasMaxLength(400);
            entity.Property(item => item.Category).HasColumnName("category").HasMaxLength(200);
        });

        ConfigureKeyless<OpportunityCountry>(modelBuilder, "opportunity_countries");
        modelBuilder.Entity<OpportunityCountry>(entity =>
        {
            entity.Property(item => item.ProgramId).HasColumnName("program_id").HasMaxLength(400);
            entity.Property(item => item.Intake).HasColumnName("intake").HasMaxLength(400);
            entity.Property(item => item.Country).HasColumnName("country").HasMaxLength(200);
        });

        ConfigureKeyless<FieldEvidence>(modelBuilder, "field_evidence");
        modelBuilder.Entity<FieldEvidence>(entity =>
        {
            entity.Property(item => item.ProgramId).HasColumnName("program_id").HasMaxLength(400);
            entity.Property(item => item.Intake).HasColumnName("intake").HasMaxLength(400);
            entity.Property(item => item.Field).HasColumnName("field").HasMaxLength(200);
            entity.Property(item => item.Text).HasColumnName("text");
            entity.Property(item => item.SourceUrl).HasColumnName("source_url");
            entity.Property(item => item.Section).HasColumnName("section");
            entity.Property(item => item.Status).HasColumnName("status").HasMaxLength(200);
            entity.Property(item => item.FetchedAt).HasColumnName("fetched_at").HasMaxLength(200);
        });

        ConfigureAdmissionEntity<AdmissionInstitution>(modelBuilder, "admission_institutions");
        modelBuilder.Entity<AdmissionInstitution>(entity =>
        {
            entity.Property(item => item.Name).HasColumnName("name");
            entity.Property(item => item.Country).HasColumnName("country");
            entity.Property(item => item.City).HasColumnName("city");
            entity.Property(item => item.Region).HasColumnName("region");
            entity.Property(item => item.Kind).HasColumnName("kind");
            entity.Property(item => item.MetadataJson).HasColumnName("metadata_json");
        });

        ConfigureAdmissionEntity<AdmissionProgram>(modelBuilder, "admission_programs");
        modelBuilder.Entity<AdmissionProgram>(entity =>
        {
            entity.Property(item => item.InstitutionId).HasColumnName("institution_id");
            entity.Property(item => item.Code).HasColumnName("code");
            entity.Property(item => item.Name).HasColumnName("name");
            entity.Property(item => item.Faculty).HasColumnName("faculty");
            entity.Property(item => item.AcademicYear).HasColumnName("academic_year");
            entity.Property(item => item.SourceUrl).HasColumnName("source_url");
            entity.Property(item => item.EvidenceText).HasColumnName("evidence_text");
            entity.Property(item => item.ReviewStatus).HasColumnName("review_status");
            entity.Property(item => item.SourceId).HasColumnName("source_id");
            entity.Property(item => item.VersionId).HasColumnName("version_id");
        });

        ConfigureAdmissionEntity<AdmissionFact>(modelBuilder, "admission_facts");
        modelBuilder.Entity<AdmissionFact>(entity =>
        {
            entity.Property(item => item.InstitutionId).HasColumnName("institution_id");
            entity.Property(item => item.SourceId).HasColumnName("source_id");
            entity.Property(item => item.Field).HasColumnName("field");
            entity.Property(item => item.Text).HasColumnName("text");
            entity.Property(item => item.Section).HasColumnName("section");
            entity.Property(item => item.PageNo).HasColumnName("page_no").HasColumnType("int");
            entity.Property(item => item.AcademicYear).HasColumnName("academic_year");
            entity.Property(item => item.YearStatus).HasColumnName("year_status");
            entity.Property(item => item.NumericValue).HasColumnName("numeric_value").HasColumnType("decimal(18,2)");
            entity.Property(item => item.Currency).HasColumnName("currency");
            entity.Property(item => item.Period).HasColumnName("period");
            entity.Property(item => item.ScoreKind).HasColumnName("score_kind");
            entity.Property(item => item.ScopeJson).HasColumnName("scope_json");
            entity.Property(item => item.Method).HasColumnName("method");
            entity.Property(item => item.ReviewStatus).HasColumnName("review_status");
            entity.Property(item => item.FetchedAt).HasColumnName("fetched_at");
            entity.Property(item => item.VersionId).HasColumnName("version_id");
        });

        ConfigureAdmissionEntity<AdmissionSource>(modelBuilder, "admission_sources");
        modelBuilder.Entity<AdmissionSource>(entity =>
        {
            entity.Property(item => item.InstitutionId).HasColumnName("institution_id");
            entity.Property(item => item.SourceUrl).HasColumnName("source_url");
            entity.Property(item => item.Title).HasColumnName("title");
            entity.Property(item => item.ContentType).HasColumnName("content_type");
            entity.Property(item => item.FetchedAt).HasColumnName("fetched_at");
            entity.Property(item => item.AcademicYearsJson).HasColumnName("academic_years_json");
            entity.Property(item => item.RawPath).HasColumnName("raw_path");
            entity.Property(item => item.Text).HasColumnName("text");
            entity.Property(item => item.LinksJson).HasColumnName("links_json");
            entity.Property(item => item.Status).HasColumnName("status");
            entity.Property(item => item.Error).HasColumnName("error");
            entity.Property(item => item.LastAttemptedAt).HasColumnName("last_attempted_at");
            entity.Property(item => item.VersionId).HasColumnName("version_id");
        });

        ConfigureAdmissionEntity<AdmissionOpportunityLink>(modelBuilder, "admission_opportunity_links");
        modelBuilder.Entity<AdmissionOpportunityLink>(entity =>
        {
            entity.Property(item => item.InstitutionId).HasColumnName("institution_id");
            entity.Property(item => item.ProgramId).HasColumnName("program_id");
            entity.Property(item => item.Intake).HasColumnName("intake");
            entity.Property(item => item.Relation).HasColumnName("relation");
            entity.Property(item => item.ReviewStatus).HasColumnName("review_status");
        });
    }

    private static void ConfigureKeyless<TEntity>(ModelBuilder modelBuilder, string tableName)
        where TEntity : class
    {
        modelBuilder.Entity<TEntity>().HasNoKey().ToTable(tableName, "dbo");
    }

    private static void ConfigureAdmissionEntity<TEntity>(ModelBuilder modelBuilder, string tableName)
        where TEntity : class
    {
        modelBuilder.Entity<TEntity>(entity =>
        {
            entity.ToTable(tableName, "dbo");
            entity.HasKey("Id");
            entity.Property<string>("Id").HasColumnName("id").HasMaxLength(200).IsRequired();
        });
    }
}
