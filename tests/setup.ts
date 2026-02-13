import '@testing-library/jest-dom/jest-globals';
import { afterEach } from '@jest/globals';
import { cleanup } from '@testing-library/react';

// Cleanup after each test to prevent pollution
afterEach(() => {
  cleanup();
});
