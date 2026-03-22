import type { EventPayloadMap } from '@octokit/webhooks-types';

interface GitHubContextBase<Event, Payload> {
	action: string;
	actor: string;
	apiUrl: string;
	eventName: Event;
	graphqlUrl: string;
	job: string;
	payload: Payload;
	ref: string;
	runAttempt: number;
	runId: number;
	runNumber: number;
	serverUrl: string;
	sha: string;
	workflow: string;
}

export type GitHubContext = {
	[EventName in keyof EventPayloadMap]: GitHubContextBase<EventName, EventPayloadMap[EventName]>;
}[keyof EventPayloadMap];
