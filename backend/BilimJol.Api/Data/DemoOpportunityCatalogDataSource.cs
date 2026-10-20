using BilimJol.Api.DTOs;

namespace BilimJol.Api.Data;

public sealed class DemoOpportunityCatalogDataSource : IOpportunityCatalogDataSource
{
    private static readonly IReadOnlyList<OpportunityDetailsDto> Items =
    [
        new()
        {
            Id = "demo-programming-summer-school",
            Title = "Демо: летняя школа по программированию",
            Organization = "BilimJol Demo Lab",
            Description = "Пример карточки летней образовательной программы для демонстрации каталога.",
            Country = "Кыргызстан",
            Category = "Летняя школа",
            Field = "Информатика",
            EducationLevel = "Школьник",
            Financing = "Частичное",
            Deadline = new DateOnly(2026, 11, 20),
            Language = "Русский",
            MinimumLanguageLevel = "Не указан",
            MinimumGpa = null,
            MinimumCourse = null,
            OfficialUrl = "https://example.org/bilimjol-demo/programming-school",
            IsVerified = false,
            IsDemo = true,
            VerificationStatus = "Демонстрационная запись",
            Requirements = ["Требования приведены только для демонстрации."],
            RequiredDocuments = ["Демо: анкета участника", "Демо: школьный табель"]
        },
        new()
        {
            Id = "demo-masters-scholarship",
            Title = "Демо: стипендия на обучение в магистратуре",
            Organization = "BilimJol Demo Lab",
            Description = "Вымышленный пример международной стипендии для демонстрации фильтров.",
            Country = "Европа",
            Category = "Стипендия",
            Field = "Социальные науки",
            EducationLevel = "Магистратура",
            Financing = "Полное",
            Deadline = new DateOnly(2027, 1, 15),
            Language = "Английский",
            MinimumLanguageLevel = "Не указан",
            MinimumGpa = null,
            MinimumCourse = null,
            OfficialUrl = "https://example.org/bilimjol-demo/masters-scholarship",
            IsVerified = false,
            IsDemo = true,
            VerificationStatus = "Демонстрационная запись",
            Requirements = ["Условия не заданы: это демонстрационная запись."],
            RequiredDocuments = ["Демо: мотивационное письмо", "Демо: выписка оценок"]
        },
        new()
        {
            Id = "demo-regional-grant",
            Title = "Демо: региональный грант для студентов",
            Organization = "BilimJol Demo Lab",
            Description = "Вымышленный пример грантовой программы для демонстрации каталога.",
            Country = "Казахстан",
            Category = "Грант",
            Field = "Инженерия",
            EducationLevel = "Бакалавриат",
            Financing = "Частичное",
            Deadline = new DateOnly(2027, 3, 1),
            Language = "Русский",
            MinimumLanguageLevel = null,
            MinimumGpa = null,
            MinimumCourse = 1,
            OfficialUrl = "https://example.org/bilimjol-demo/regional-grant",
            IsVerified = false,
            IsDemo = true,
            VerificationStatus = "Демонстрационная запись",
            Requirements = ["Условия не заданы: это демонстрационная запись."],
            RequiredDocuments = ["Демо: подтверждение обучения"]
        },
        new()
        {
            Id = "demo-sustainability-internship",
            Title = "Демо: стажировка по устойчивому развитию",
            Organization = "BilimJol Demo Lab",
            Description = "Вымышленная стажировка для демонстрации программы без известного срока.",
            Country = "Германия",
            Category = "Стажировка",
            Field = "Экология",
            EducationLevel = "Студент",
            Financing = "Не указано",
            Deadline = null,
            Language = "Немецкий",
            MinimumLanguageLevel = null,
            MinimumGpa = null,
            MinimumCourse = null,
            OfficialUrl = "https://example.org/bilimjol-demo/internship",
            IsVerified = false,
            IsDemo = true,
            VerificationStatus = "Демонстрационная запись",
            Requirements = ["Условия и срок подачи не указаны в демонстрационной записи."],
            RequiredDocuments = ["Демо: резюме"]
        }
    ];

    public Task<IReadOnlyList<OpportunityDetailsDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        return Task.FromResult(Items);
    }
}
