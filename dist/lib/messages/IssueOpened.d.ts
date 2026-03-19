import { ContainerBuilder } from '@discordjs/builders';
import type { GitHubIssue, GitHubRepository } from '#/types/GitHub.js';
export declare function ISSUE_OPENED_MESSAGE({ issue, repository, }: IssueOpenedMessageOptions): ContainerBuilder;
interface IssueOpenedMessageOptions {
    issue: GitHubIssue;
    repository: GitHubRepository;
}

