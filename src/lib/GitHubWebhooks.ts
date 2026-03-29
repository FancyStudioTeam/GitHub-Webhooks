import { Webhooks } from '@octokit/webhooks';
import { GITHUB_WEBHOOK_SECRET } from './Constants.js';

export const GitHubWebhooks = new Webhooks({
	secret: GITHUB_WEBHOOK_SECRET,
});
