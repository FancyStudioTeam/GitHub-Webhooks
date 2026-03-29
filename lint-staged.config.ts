import type { Configuration } from 'lint-staged';

export default {
	'**/*.{js,ts,json}': 'pnpm biome:write',
} as Configuration;
