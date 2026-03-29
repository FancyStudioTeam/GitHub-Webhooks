import type { Snowflake } from 'discord-api-types/globals';

export function parseWebhookUrl(url: string): WebhookUrlData {
	const matches =
		url.match(
			/https?:\/\/(?:ptb\.|canary\.)?discord\.com\/api(?:\/v\d{1,2})?\/webhooks\/(\d{17,19})\/([\w-]{68})/i,
		) ?? [];
	const [, id, token] = matches;

	return {
		id,
		token,
	};
}

interface WebhookUrlData {
	id: Snowflake;
	token: string;
}
