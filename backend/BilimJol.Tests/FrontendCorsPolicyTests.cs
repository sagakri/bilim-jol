using BilimJol.Api;

namespace BilimJol.Tests;

public sealed class FrontendCorsPolicyTests
{
    [Theory]
    [InlineData("http://localhost:5173")]
    [InlineData("http://localhost:5174")]
    public void Allows_supported_local_frontend_origins(string origin)
    {
        Assert.Contains(origin, FrontendCorsPolicy.AllowedOrigins);
    }

    [Theory]
    [InlineData("http://localhost:5175")]
    [InlineData("https://localhost:5174")]
    [InlineData("http://example.com:5174")]
    public void Does_not_allow_other_origins(string origin)
    {
        Assert.DoesNotContain(origin, FrontendCorsPolicy.AllowedOrigins);
    }
}
