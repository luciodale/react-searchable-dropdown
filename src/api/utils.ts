export function emitAuthError() {
  // Implement your auth error handling logic
  console.error('Authentication error occurred');
  // Perhaps dispatch an event or action
}

export function getRegionNamespacedUrl(url: string): string {
  // Implement your region namespacing logic
  // For example: return `https://api.${region}.example.com${url}`;
  return url; // Placeholder implementation
}

export function parseBody(body: unknown): string {
  return typeof body === 'string' ? body : JSON.stringify(body);
}

export function urlWithQueryParams(
  url: string, 
  queryParams?: Record<string, string>
): string {
  if (!queryParams) return url;
  
  const searchParams = new URLSearchParams();
  Object.entries(queryParams).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  
  return `${url}${url.includes('?') ? '&' : '?'}${searchParams.toString()}`;
} 