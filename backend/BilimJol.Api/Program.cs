using Microsoft.EntityFrameworkCore;
using BilimJol.Api.Data;
using BilimJol.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
var joltapConnection = builder.Configuration.GetConnectionString("JolTap");
if (string.IsNullOrWhiteSpace(joltapConnection))
{
    builder.Services.AddSingleton<IOpportunityCatalogDataSource, DemoOpportunityCatalogDataSource>();
}
else
{
    builder.Services.AddDbContext<JolTapDbContext>(options => options.UseSqlServer(joltapConnection));
    builder.Services.AddScoped<IOpportunityCatalogDataSource, JolTapOpportunityCatalogDataSource>();
}
builder.Services.AddScoped<OpportunityCatalogService>();
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
    policy.WithOrigins("http://localhost:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();
app.UseCors("Frontend");
app.MapControllers();
app.Run();

public partial class Program;
