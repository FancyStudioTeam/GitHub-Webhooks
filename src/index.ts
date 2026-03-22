import { getInput, info, setFailed } from '@actions/core';
import { context } from '@actions/github';
import { handleEvent } from './lib/Handlers.js';
import type { GitHubContext } from './lib/Types.js';
import { WebhookClient } from './structures/WebhookClient.js';

(async () => {
	const gitHubContext = context as unknown as GitHubContext;

	showContextData(gitHubContext);

	const webhookId = getInput('webhook_id');
	const webhookToken = getInput('webhook_token');

	const webhookClient = new WebhookClient(webhookId, webhookToken);

	try {
		await handleEvent(webhookClient, gitHubContext);
	} catch (error) {
		setFailed(`❌ ${error}`);
	}
})();

function showContextData(gitHubContext: GitHubContext): void {
	info(`ℹ️ Context Information: ${JSON.stringify(gitHubContext, null, 4)}`);
}
