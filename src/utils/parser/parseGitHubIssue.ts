import type { GitHubIssue, RawGitHubIssue } from '#/types/GitHub.js';

export function parseGitHubIssue(payload: Record<string, unknown>): GitHubIssue {
	const { issue } = payload;
	const { body, html_url, title } = issue as RawGitHubIssue;

	const gitHubIssue: GitHubIssue = {
		body: body || null,
		title,
		url: html_url,
	};

	return gitHubIssue;
}
