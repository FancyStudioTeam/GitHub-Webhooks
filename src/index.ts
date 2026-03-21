import { getInput, info, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { EventHandlersMap } from './lib/Handlers.js';
import { WebhookClient } from './structures/WebhookClient.js';

(async () => {
	showContextData(context);

	const { eventName, payload } = context;

	const webhookId = getInput('webhook_id');
	const webhookToken = getInput('webhook_token');

	try {
		const webhookClient = new WebhookClient(webhookId, webhookToken);
		const eventHandler = EventHandlersMap.get(eventName);

		if (eventHandler) {
			await eventHandler(webhookClient, payload);
		}
	} catch {
		setFailed('❌ Something went wrong while executing the action [Unknown Error]');
	}
})();

function showContextData(gitHubContext: GitHubContext): void {
	info(`ℹ️ Context Information: ${JSON.stringify(gitHubContext, null, 4)}`);
}

type GitHubContext = typeof context;
