import type { WebhookEvent } from '@octokit/webhooks-types';
import { GitHubWebhooks } from './lib/GitHubWebhooks.js';
import {
	INTERNAL_SERVER_ERROR_RESPONSE,
	METHOD_NOT_ALLOWED_RESPONSE,
	NO_CONTENT_RESPONSE,
	NOT_FOUND_RESPONSE,
	OK_RESPONSE,
	UNAUTHORIZED_RESPONSE,
	UNPROCESSABLE_CONTENT_RESPONSE,
} from './lib/Responses.js';
import { WEBHOOKS } from './lib/Webhooks.js';
import { Webhook } from './structures/Webhook.js';
import { createWebhookMessage } from './utils/createWebhookMessage.js';
import { getRepositoryId } from './utils/getRepositoryId.js';

const handler: ExportedHandlerFetchHandler<Env> = async (request) => {
	const { headers } = request;
	const webhookEvent = headers.get('X-GitHub-Event');

	if (!webhookEvent) {
		return UNPROCESSABLE_CONTENT_RESPONSE();
	}

	let webhookEventPayload: WebhookEvent;

	try {
		webhookEventPayload = await request.json();
	} catch {
		return INTERNAL_SERVER_ERROR_RESPONSE();
	}

	let repositoryId: string;

	try {
		repositoryId = String(getRepositoryId(webhookEventPayload));
	} catch {
		return NOT_FOUND_RESPONSE();
	}

	const webhookMessage = createWebhookMessage(webhookEvent, webhookEventPayload);

	if (webhookMessage) {
		const webhookUrl = WEBHOOKS[repositoryId];
		const webhook = new Webhook(webhookUrl);

		await webhook.execute(webhookMessage);

		return OK_RESPONSE();
	}

	return NO_CONTENT_RESPONSE();
};

function verifySignature(
	handler: ExportedHandlerFetchHandler<Env>,
): ExportedHandlerFetchHandler<Env> {
	return async (request, env, context) => {
		const { headers, method } = request;
		const signature = headers.get('X-Hub-Signature-256');

		if (method !== 'POST') {
			return METHOD_NOT_ALLOWED_RESPONSE();
		}

		if (!signature) {
			return UNPROCESSABLE_CONTENT_RESPONSE();
		}

		let body: string;

		try {
			/*
			 * Clone the current `Request` object to avoid modifying the original
			 * object.
			 */
			body = await request.clone().text();
		} catch {
			return INTERNAL_SERVER_ERROR_RESPONSE();
		}

		/* Verify that the request was sent from GitHub. */
		const isValid = await GitHubWebhooks.verify(body, signature);

		if (!isValid) {
			return UNAUTHORIZED_RESPONSE();
		}

		return handler(request, env, context);
	};
}

export default {
	fetch: verifySignature(handler),
} satisfies ExportedHandler<Env>;
