# Mapping источника данных JolTap

## Основание

Mapping проверен по SQL snapshot и сверён с живой БД `JolTap` на локальном SQL Server. Read-only запросы подтвердили таблицы, столбцы, размеры строк и ключи. По проверке интеграции 19.10.2026 API получает 20 строк `opportunities`.

Для локального запуска используется Windows Integrated Authentication. Параметры TLS и имя экземпляра задаются в локальной строке подключения и не хранятся в исходном коде.

## Возможности

| Таблица | Модель | Ключ | Назначение |
|---|---|---|---|
| `dbo.opportunities` | `Opportunity` | `program_id`, `intake` | Основные данные возможности; описание и дополнительные поля хранятся в `payload_json` |
| `dbo.opportunity_categories` | `OpportunityCategory` | отсутствует в snapshot | Категории; keyless, только чтение |
| `dbo.opportunity_countries` | `OpportunityCountry` | отсутствует в snapshot | Страны; keyless, только чтение |
| `dbo.field_evidence` | `FieldEvidence` | отсутствует в snapshot | Выдержки и происхождение полей; keyless, только чтение |

## Поступление

| Таблица | Модель | Ключ |
|---|---|---|
| `dbo.admission_institutions` | `AdmissionInstitution` | `id` |
| `dbo.admission_programs` | `AdmissionProgram` | `id` |
| `dbo.admission_facts` | `AdmissionFact` | `id` |
| `dbo.admission_sources` | `AdmissionSource` | `id` |
| `dbo.admission_opportunity_links` | `AdmissionOpportunityLink` | `id` |

Строковые поля, включая даты/суммы, сохранены строками там, где snapshot хранит их как `NVARCHAR`; numeric/page fields `admission_facts` отображаются как `decimal(18,2)` и `int`. Связи между таблицами не объявляются в EF как FK, потому что snapshot их не задаёт.

Live schema уточнила длины полей: `opportunities.program_id` и `intake` — `nvarchar(400)`, `deadline`, `review_status`, `fetched_at` — `nvarchar(200)`; таблицы категорий/стран и `field_evidence` также используют длины до `nvarchar(400)` для идентификаторов и `nvarchar(200)` для справочных полей. EF mapping обновлён по живой схеме.

`JolTapOpportunityCatalogDataSource` читает `opportunities`, категории и страны без операций записи. Возможности со статусом `needs_review` передаются frontend как «Требует проверки». Основные поля читаются из `payload_json`, дедлайн — из `opportunities.deadline`. Требования и документы берутся из `payload_json.fields.requirements` и `payload_json.fields.documents`, только при статусе `verified`/`approved`. API передаёт текст, `source_url`, `section` и `fetched_at`; frontend показывает ссылку на источник у каждого пункта. `dbo.field_evidence` в текущей интеграции остаётся отдельным хранилищем сырых фрагментов и напрямую не используется. `JolTapDbContext` не содержит миграций; база не изменялась.
