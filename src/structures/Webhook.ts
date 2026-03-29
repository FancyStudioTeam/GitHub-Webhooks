import type { ContainerBuilder } from '@discordjs/builders';
import { MessageFlags, RouteBases, Routes, type Snowflake } from 'discord-api-types/v10';
import {
	BAD_REQUEST_STATUS_CODE,
	NOT_FOUND_STATUS_CODE,
	UNAUTHORIZED_STATUS_CODE,
} from '#/lib/HttpStatus.js';
import { parseWebhookUrl } from '#/utils/parseWebhookUrl.js';

const { api } = RouteBases;
const { webhook } = Routes;

export class Webhook {
	public readonly webhookId: string;
	public readonly webhookToken: string;

	constructor(webhookUrl: string) {
		const { id, token } = parseWebhookUrl(webhookUrl);

		this.webhookId = id;
		this.webhookToken = token;
	}

	private createWebhookExecuteRequest(content: ContainerBuilder): Request {
		const { webhookId, webhookToken } = this;

		const url = this.createWebhookExecuteRequestUrl({
			webhookId,
			webhookToken,
		});
		const body = this.createWebhookExecuteRequestBody({
			content,
		});
		const headers = this.createWebhookExecuteRequestHeaders();

		const request = new Request(url, {
			body,
			headers,
			method: 'POST',
		});

		return request;
	}

	private createWebhookExecuteRequestHeaders(): HeadersInit {
		return {
			'Content-Type': 'application/json',
		};
	}

	private createWebhookExecuteRequestBody({
		content,
	}: CreateWebhookExecuteRequestBodyOptions): BodyInit {
		return JSON.stringify({
			components: [
				content,
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}

	private createWebhookExecuteRequestUrl({
		webhookId,
		webhookToken,
	}: CreateWebhookExecuteRequestUrlOptions): URL {
		const encodedWebhookId = encodeURIComponent(webhookId);
		const encodedWebhookToken = encodeURIComponent(webhookToken);

		const url = new URL(`${api}/${webhook(encodedWebhookId, encodedWebhookToken)}`);
		const { searchParams } = url;

		searchParams.append('with_components', 'true');

		return url;
	}

	public async execute(containerBuilder: ContainerBuilder): Promise<void> {
		const request = this.createWebhookExecuteRequest(containerBuilder);
		const response = await fetch(request);

		const { ok, status } = response;

		if (ok) {
			return console.info('✅ The webhook was executed successfully [OK]');
		}

		switch (status) {
			case BAD_REQUEST_STATUS_CODE: {
				const responseJson = await response.json();
				const responseJsonString = JSON.stringify(responseJson, null, 4);

				return console.error(
					`❌ The webhook did not send a valid request: ${responseJsonString}`,
				);
			}
			case UNAUTHORIZED_STATUS_CODE: {
				return console.error('❌ The webhook was not authorized [Error 401]');
			}
			case NOT_FOUND_STATUS_CODE: {
				return console.error('❌ The webhook was not found [Error 404]');
			}
			default: {
				return console.error(
					'❌ Something went wrong while executing the webhook [Unknown Error]',
				);
			}
		}
	}
}

interface CreateWebhookExecuteRequestBodyOptions {
	content: ContainerBuilder;
}

interface CreateWebhookExecuteRequestUrlOptions {
	webhookId: Snowflake;
	webhookToken: string;
}
