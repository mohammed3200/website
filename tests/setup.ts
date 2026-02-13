/// <reference types="@testing-library/jest-dom/jest-globals" />
import '@testing-library/jest-dom/jest-globals';
import { afterEach } from '@jest/globals';
import { cleanup } from '@testing-library/react';
import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Initialize happy-dom for Bun tests
GlobalRegistrator.register();

// Cleanup after each test to prevent pollution
afterEach(() => {
  cleanup();
});
