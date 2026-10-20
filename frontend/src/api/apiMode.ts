export function resolveApiBaseUrl(configuredUrl: string | undefined, isDevelopment: boolean): string | null {
  if (configuredUrl?.trim()) return configuredUrl.trim()
  return isDevelopment ? 'http://localhost:5184/api' : null
}
