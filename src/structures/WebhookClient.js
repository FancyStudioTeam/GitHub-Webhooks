// @ts-check

import { MessageFlags } from 'discord-api-types/v10';

export class WebhookClient {
	/**
	 * @param {string} webhookId
		* @param {string} webhookToken
	 */
	constructor(webhookId, webhookToken) {
		this.webhookId = webhookId;
		this.webhookToken = webhookToken;
	}

	 _createRequestUrl() {
		const { webhookId, webhookToken } = this;

		const url = new URL(`https://discord.com/api/v10/webhooks/${webhookId}/${webhookToken}`);
		const { searchParams } = url;

		searchParams.set('with_components', 'true');

		return url;
	}

	 async execute(message) {
		const url = this._createRequestUrl();

		await fetch(url, {
			body: JSON.stringify({
				components: [
					message,
				],
				flags: MessageFlags.IsComponentsV2,
			}),
			headers: {
				'content-type': 'application/json',
			},
			method: 'POST',
		});
	}
}
