import { defineConfig } from 'vitest/config';

// tsconfig has jsx:"preserve" (for Next), so tell the test transformer to compile JSX itself.
export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  test: { include: ['tests/**/*.test.{ts,tsx}'], env: { SESSION_SECRET: 'test-secret-test-secret-test-secret-123' } },
} as never);
