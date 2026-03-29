export function createResponse(statusCode: number, statusText: string): Response {
	return new Response(statusText, {
		status: statusCode,
		statusText,
	});
}
