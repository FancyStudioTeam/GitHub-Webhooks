import type { GitHubRepository, RawGitHubRepository } from '#/types/GitHub.js';

export function parseGitHubRepository(payload: Record<string, unknown>): GitHubRepository {
	const { repository } = payload;
	const { full_name, html_url, name } = repository as RawGitHubRepository;

	const gitHubRepository: GitHubRepository = {
		fullName: full_name,
		name,
		url: html_url,
	};

	return gitHubRepository;
}
