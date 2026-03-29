import type { Repository, WebhookEvent } from '@octokit/webhooks-types';

export function getRepositoryId(webhookEvent: WebhookEvent): number {
	if (!hasRepositoryField(webhookEvent)) {
		throw new TypeError(`Webhook event does not include 'repository' field`);
	}

	const { repository } = webhookEvent;
	const { id } = repository;

	return id;
}

function hasRepositoryField(webhookEvent: unknown): webhookEvent is WebhookEventWithRepository {
	return isObject(webhookEvent) && Reflect.has(webhookEvent, 'repository');
}

function isObject(input: unknown): input is object {
	return typeof input === 'object' && input !== null;
}

type WebhookEventWithRepository = WithRepository<WebhookEvent>;

type WithRepository<WebhookEvent> = WebhookEvent extends {
	repository: Repository;
}
	? WebhookEvent
	: never;
