import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		// Run all tests under the test/ folder
		include: ['test/**/*.test.ts'],
		// Use Node environment for tests
		environment: 'node',
		// Treat globals like describe/it as defined
		globals: true,
		// Fail if no tests are found by default (set true if you prefer passing with no tests)
		passWithNoTests: false
	}
});
