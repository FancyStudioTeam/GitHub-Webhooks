import {
	ContainerBuilder,
	HeadingLevel,
	heading,
	hyperlink,
	TextDisplayBuilder,
	bold,
	escapeBold,
	escapeMarkdown,
	SeparatorBuilder,
} from '@discordjs/builders';
import { IssuesOpenedEvent } from '@octokit/webhooks-types';

import { GREEN_COLOR } from '#/lib/Colors.js';
import { ISSUE_OPENED_EMOJI } from '#/lib/Emojis.js';

export class IssueOpenedEventHandler {
	private static _createContainerSubtitle(
		issueOpenedEvent: IssuesOpenedEvent,
	): TextDisplayBuilder {
		const containerSubtitleString =
			IssueOpenedEventHandler._formatContainerSubtitle(issueOpenedEvent);
		const containerSubtitleBuilder = new TextDisplayBuilder().setContent(
			containerSubtitleString,
		);

		return containerSubtitleBuilder;
	}

	private static _createContainerTitle(issueOpenedEvent: IssuesOpenedEvent): TextDisplayBuilder {
		const containerTitleString =
			IssueOpenedEventHandler._formatContainerTitle(issueOpenedEvent);
		const containerTitleBuilder = new TextDisplayBuilder().setContent(containerTitleString);

		return containerTitleBuilder;
	}

	private static _formatContainerSubtitle(issueOpenedEvent: IssuesOpenedEvent): string {
		const { issue } = issueOpenedEvent;
		const { title: issueTitle } = issue;

		return bold(escapeBold(issueTitle));
	}

	private static _formatContainerTitle(issueOpenedEvent: IssuesOpenedEvent): string {
		const { issue, repository, sender } = issueOpenedEvent;

		const { html_url: issueHtmlUrl, number: issueNumber } = issue;
		const { full_name: repositoryFullName } = repository;
		const { login: senderLogin } = sender;

		const title = escapeMarkdown(
			`${ISSUE_OPENED_EMOJI} [${repositoryFullName}] ${senderLogin} has Opened Issue #${issueNumber}`,
		);

		return heading(hyperlink(title, issueHtmlUrl), HeadingLevel.Three);
	}

	public static handle(issueOpenedEvent: IssuesOpenedEvent): ContainerBuilder {
		const { issue } = issueOpenedEvent;
		const { body: issueBody } = issue;

		const containerBuilder = new ContainerBuilder();

		const containerTitleBuilder =
			IssueOpenedEventHandler._createContainerTitle(issueOpenedEvent);
		const containerSubtitleBuilder =
			IssueOpenedEventHandler._createContainerSubtitle(issueOpenedEvent);

		containerBuilder.setAccentColor(GREEN_COLOR);
		containerBuilder.addTextDisplayComponents(containerTitleBuilder, containerSubtitleBuilder);

		if (issueBody) {
			const containerSeparatorBuilder = new SeparatorBuilder();
			const containerBodyBuilder = new TextDisplayBuilder();

			containerBodyBuilder.setContent(issueBody);

			containerBuilder.addSeparatorComponents(containerSeparatorBuilder);
			containerBuilder.addTextDisplayComponents(containerBodyBuilder);
		}

		return containerBuilder;
	}
}
