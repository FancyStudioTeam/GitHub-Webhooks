import { info, setFailed } from '@actions/core';
import type { ContainerBuilder } from '@discordjs/builders';
import { MessageFlags, RouteBases, Routes } from 'discord-api-types/v10';

const { api } = RouteBases;
const { webhook } = Routes;

enum HttpStatusCode {
	NotFound = 404,
	Ok = 200,
	Unauthorized = 401,
}

export class WebhookClient {
	public readonly webhookId: string;
	public readonly webhookToken: string;

	constructor(webhookId: string, webhookToken: string) {
		this.webhookId = webhookId;
		this.webhookToken = webhookToken;
	}

	private createWebhookExecuteRequest(containerBuilder: ContainerBuilder): Request {
		const { webhookId, webhookToken } = this;

		const requestUrl = `${api}/${webhook(webhookId, webhookToken)}?with_components=true`;
		const requestBody = JSON.stringify({
			components: [
				containerBuilder,
			],
			flags: MessageFlags.IsComponentsV2,
		});

		const request = new Request(requestUrl, {
			body: requestBody,
			method: 'POST',
		});

		return request;
	}

	public async execute(containerBuilder: ContainerBuilder): Promise<void> {
		const request = this.createWebhookExecuteRequest(containerBuilder);
		const response = await fetch(request);

		const { status } = response;

		switch (status) {
			case HttpStatusCode.Ok: {
				return info('Webhook message has been created successfully');
			}
			case HttpStatusCode.NotFound: {
				return setFailed('Webhook has not been found');
			}
			case HttpStatusCode.Unauthorized: {
				return setFailed('Webhook has been unauthorized');
			}
			default: {
				return setFailed('Something went wrong while executing the webhook');
			}
		}
	}
}
