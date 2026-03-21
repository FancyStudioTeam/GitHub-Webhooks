import {
	ContainerBuilder,
	HeadingLevel,
	heading,
	hyperlink,
	TextDisplayBuilder,
	escapeMarkdown,
} from '@discordjs/builders';
import { IssuesClosedEvent } from '@octokit/webhooks-types';

import { PURPLE_COLOR } from '#/lib/Colors.js';

export class IssueClosedEventHandler {
	private static _createContainerTitle(issueClosedEvent: IssuesClosedEvent): TextDisplayBuilder {
		const containerTitleString =
			IssueClosedEventHandler._formatContainerTitle(issueClosedEvent);
		const containerTitleBuilder = new TextDisplayBuilder().setContent(containerTitleString);

		return containerTitleBuilder;
	}

	private static _formatContainerTitle(issueClosedEvent: IssuesClosedEvent): string {
		const { issue, repository, sender } = issueClosedEvent;

		const { html_url: issueHtmlUrl, number: issueNumber } = issue;
		const { name: repositoryFullName } = repository;
		const { login: senderLogin } = sender;

		const title = escapeMarkdown(
			`[${repositoryFullName}] ${senderLogin} has Closed Issue #${issueNumber}`,
		);

		return heading(hyperlink(title, issueHtmlUrl), HeadingLevel.Three);
	}

	public static handle(issueClosedEvent: IssuesClosedEvent): ContainerBuilder {
		const containerBuilder = new ContainerBuilder();
		const containerTitleBuilder =
			IssueClosedEventHandler._createContainerTitle(issueClosedEvent);

		containerBuilder.setAccentColor(PURPLE_COLOR);
		containerBuilder.addTextDisplayComponents(containerTitleBuilder);

		return containerBuilder;
	}
}
