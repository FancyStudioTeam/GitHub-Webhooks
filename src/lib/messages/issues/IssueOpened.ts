/* biome-ignore-all lint/style/useNamingConvention: (x) */

import {
	ContainerBuilder,
	HeadingLevel,
	heading,
	hyperlink,
	SeparatorBuilder,
	TextDisplayBuilder,
} from '@discordjs/builders';
import { GREEN_COLOR } from '#/lib/Colors.js';
import { ISSUE_OPENED_EMOJI } from '#/lib/Emojis.js';
import type { IssueMessageOptions } from './shared.js';

export function ISSUE_OPENED_MESSAGE({ issue, repository }: IssueMessageOptions): ContainerBuilder {
	const { body: issueBody, number: issueNumber, title: issueTitle, url: issueUrl } = issue;
	const { fullName: repositoryFullName } = repository;

	const containerBuilder = new ContainerBuilder();
	const containerTitleBuilder = new TextDisplayBuilder();

	containerTitleBuilder.setContent(
		heading(
			hyperlink(
				`${ISSUE_OPENED_EMOJI} [${repositoryFullName}] (Issue #${issueNumber}) ${issueTitle}`,
				issueUrl,
			),
			HeadingLevel.Three,
		),
	);

	containerBuilder.addTextDisplayComponents(containerTitleBuilder);
	containerBuilder.setAccentColor(GREEN_COLOR);

	if (issueBody) {
		const containerBodyBuilder = new TextDisplayBuilder();
		const containerSeparatorBuilder = new SeparatorBuilder();

		containerBodyBuilder.setContent(issueBody);

		containerBuilder.addSeparatorComponents(containerSeparatorBuilder);
		containerBuilder.addTextDisplayComponents(containerBodyBuilder);
	}

	return containerBuilder;
}
