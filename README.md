# BilimJol

Русскоязычный веб-прототип каталога образовательных возможностей для школьников и студентов Кыргызстана. Доступны каталог, поиск и фильтры, подробная страница программы, избранное, отслеживание дедлайнов и чек-лист документов. С подключением `ConnectionStrings__JolTap` каталог загружает 20 записей из SQL Server JolTap; без строки подключения использует четыре демонстрационные программы.

## Запуск

Нужны .NET 10 SDK, Node.js и pnpm.

В первом терминале из папки `bilimjol` включите подключение к локальной JolTap и запустите API:

```powershell
$env:ConnectionStrings__JolTap = 'Server=.\SQLEXPRESS;Database=JolTap;Integrated Security=True;Encrypt=True;TrustServerCertificate=True;Application Name=BilimJol'
dotnet run --project backend/BilimJol.Api/BilimJol.Api.csproj --urls http://localhost:5184
```

Подключение использует текущую Windows-учётную запись. Для локального SQL Server при необходимости добавьте `TrustServerCertificate=True` в строку подключения; используйте этот параметр только для доверенного локального экземпляра. API читает каталог через EF Core и не запускает миграции/изменения базы. Если переменная подключения не задана, API стартует с демонстрационным каталогом.

Во втором терминале:

```powershell
Set-Location frontend
pnpm install
pnpm dev -- --port 5173
```

Откройте `http://localhost:5173/opportunities`. Frontend обращается к `http://localhost:5184/api`; адрес можно переопределить переменной `VITE_API_BASE_URL` (см. `frontend/.env.example`).

## Проверки

Из папки `bilimjol`:

```powershell
dotnet test backend/BilimJol.Tests/BilimJol.Tests.csproj
Set-Location frontend
pnpm test
pnpm build
```

Backend-тесты проверяют EF Core mapping и правила каталога. Frontend-тесты проверяют поиск и сочетание фильтров.

Пользовательские отметки сохраняются в `localStorage` этого браузера. Для тестового сброса можно очистить данные сайта в настройках браузера.

## Данные и следующий этап

API подключается к SQL Server 2022 `JolTap` через Windows Integrated Security и читает 20 возможностей. Каталог не меняет существующую базу. Фактические поля и типы сверены с live schema; заметки и mapping находятся в [docs/joltap-mapping.md](docs/joltap-mapping.md). Требования и документы передаются вместе со ссылками на их источники. Вход, пользовательские профили, синхронизация отметок между устройствами, админ-панель и уведомления требуют следующего этапа.

Архитектурные решения и неизменяемые требования собраны в [spec.md](spec.md).
