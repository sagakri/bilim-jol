namespace BilimJol.Api;

public static class FrontendCorsPolicy
{
    public static IReadOnlyList<string> AllowedOrigins { get; } = Array.AsReadOnly(
    [
        "http://localhost:5173",
        "http://localhost:5174"
    ]);
}
