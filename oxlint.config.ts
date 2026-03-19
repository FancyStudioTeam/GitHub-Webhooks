import { defineConfig } from 'oxlint';

export default defineConfig({
	ignorePatterns: ['**/dist'],
	rules: {
		eqeqeq: 'error',
		'sort-keys': 'warn',
	},
});
