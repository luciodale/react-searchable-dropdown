/**
 * Builds a URL with query parameters
 * @param baseUrl - The base URL or path (e.g., '/api/search' or 'https://example.com/api')
 * @param queryParams - Object containing query parameters
 * @returns The complete URL with encoded query parameters
 */
export function urlWithQueryParams(
	baseUrl: string,
	queryParams: Record<
		string,
		string | number | boolean | undefined | null
	> = {},
): string {
	try {
		// Ensure the URL has a proper origin if it's a relative path
		const url = new URL(baseUrl, window.location.origin);

		// Add query parameters
		for (const [key, value] of Object.entries(queryParams)) {
			// Skip undefined and null values
			if (value === undefined || value === null) continue;

			// Convert value to string
			const stringValue = String(value);
			url.searchParams.append(key, stringValue);
		}

		return url.toString();
	} catch (error) {
		console.error("Error building URL:", error);
		throw new Error("Invalid URL format");
	}
}
