import type { components } from '@octokit/openapi-types';

export interface GitHubIssue {
	body: string | null;
	title: string;
	url: string;
}

export interface GitHubRepository {
	fullName: string;
	name: string;
	url: string;
}

export type RawGitHubIssue = components['schemas']['issue'];
export type RawGitHubRepository = components['schemas']['repository'];
