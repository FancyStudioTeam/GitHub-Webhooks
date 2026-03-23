import { getInput, info, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { handleEvent } from './lib/Handlers.js';
import type { GitHubContext } from './lib/Types.js';
import { WebhookClient } from './structures/WebhookClient.js';

(async () => {
	const gitHubContext = context as unknown as GitHubContext;

	showContextData(gitHubContext);

	const webhookId = getInput('webhook_id', {
		required: true,
	});
	const webhookToken = getInput('webhook_token', {
		required: true,
	});
	const webhookThreadId = getInput('webhook_thread_id');

	/*
	 * NOTE: getInput returns an empty string if the input is not defined.
	 * Must use OR operator to use `null` as fallback.
	 */
	const webhookClient = new WebhookClient(webhookId, webhookToken, webhookThreadId || null);

	try {
		await handleEvent(webhookClient, gitHubContext);
	} catch (error) {
		setFailed(`❌ ${error}`);
	}
})();

function showContextData(gitHubContext: GitHubContext): void {
	info(`ℹ️ Context Information: ${JSON.stringify(gitHubContext, null, 4)}`);
}
