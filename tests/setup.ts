import '@testing-library/jest-dom/jest-globals';
import { type expect } from 'bun:test';
import { type TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'bun:test' {
  interface Matchers<T>
    extends TestingLibraryMatchers<
      ReturnType<typeof expect.stringContaining>,
      T
    > {}
}
import { afterEach } from 'bun:test';
import { cleanup } from '@testing-library/react';

// Cleanup after each test to prevent pollution
afterEach(() => {
  cleanup();
});
