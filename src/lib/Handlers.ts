import type { ContainerBuilder } from '@discordjs/builders';
import { match, P } from 'ts-pattern';
import { IssueClosedEventHandler } from '#/events/issues/IssueClosed.js';
import { IssueOpenedEventHandler } from '#/events/issues/IssueOpened.js';
import { PushEventHandler } from '#/events/Push.js';
import type { WebhookClient } from '#/structures/WebhookClient.js';
import type { GitHubContext } from './Types.js';

export async function handleEvent(webhookClient: WebhookClient, gitHubContext: GitHubContext): Promise<void> {
	const containerBuilder = match(gitHubContext)
		.returnType<ContainerBuilder | undefined>()
		.with(
			{
				eventName: 'issues',
			},
			({ payload }) =>
				match(payload)
					.returnType<ContainerBuilder | undefined>()
					.with(
						{
							action: 'closed',
						},
						(payload) => IssueClosedEventHandler.handle(payload),
					)
					.with(
						{
							action: 'opened',
						},
						(payload) => IssueOpenedEventHandler.handle(payload),
					)
					.with(P._, () => undefined)
					.run(),
		)
		.with(
			{
				eventName: 'push',
			},
			({ payload }) => PushEventHandler.handle(payload),
		)
		.with(P._, () => undefined)
		.run();

	if (containerBuilder) {
		await webhookClient.execute(containerBuilder);
	}
}
