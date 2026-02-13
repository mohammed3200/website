import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Initialize happy-dom for Jest environment before other imports
GlobalRegistrator.register();

import '@testing-library/jest-dom/jest-globals';
import { afterEach } from '@jest/globals';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
