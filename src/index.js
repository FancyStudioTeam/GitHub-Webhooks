// @ts-check

import { context } from '@actions/github';
import { getInput, setFailed } from '@actions/core';
import { parseGitHubRepository } from './utils/parser/parseGitHubRepository.js';
import { parseGitHubIssue } from './utils/parser/parseGitHubIssue.js';
import { WebhookClient } from './structures/WebhookClient.js';
import { ISSUE_OPENED_MESSAGE } from './lib/messages/IssueOpened.js';

async function run() {
	try {
		const webhookId = getInput('webhook_id');
		const webhookToken = getInput('webhook_token');

		const webhook = new WebhookClient(webhookId, webhookToken);

		const { eventName, payload } = context;

		console.dir(context, {
			colors: true,
			depth: null,
		});

		switch (eventName) {
			case 'issues': {
				const { action } = payload;

				if (!action) {
					return setFailed('Cannot handle issue without an action');
				}

				const issue = parseGitHubIssue(payload);
				const repository = parseGitHubRepository(payload);

				const messages = {
					opened: ISSUE_OPENED_MESSAGE({
						issue,
						repository,
					}),
				};

				const message = messages[action];

				if (message) {
					await webhook.execute(message);
				}
			}
		}
	} catch (error) {
		if (error instanceof Error) {
			setFailed(error);
		}
	}
}

run();
