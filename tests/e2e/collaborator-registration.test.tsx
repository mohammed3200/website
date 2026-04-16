import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollaboratorFormWizard } from '@/features/collaborators/components/collaborator-form-wizard';
import { useCollaboratorFormStore } from '@/features/collaborators/store';
import { NextIntlClientProvider } from 'next-intl';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useParams: () => ({
    locale: 'en',
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  const ActualComponent = ({ children, ...props }: any) => React.createElement('div', props, children);
  return {
    motion: {
      div: ActualComponent,
      span: ActualComponent,
      h1: ActualComponent,
      h2: ActualComponent,
      p: ActualComponent,
      main: ActualComponent,
      section: ActualComponent,
      nav: ActualComponent,
    },
    AnimatePresence: ({ children }: any) => React.createElement(React.Fragment, {}, children),
    useAnimation: () => ({ start: jest.fn(), stop: jest.fn(), set: jest.fn() }),
    useInView: () => [null, true],
  };
});

const messages = {
  Common: {
    next: 'Next',
    back: 'Back',
    submit: 'Submit Application',
    navigation: 'Navigation',
  },
  Validation: {
    RequiredField: 'This field is required',
    validationError: 'Validation Error',
    pleaseFixErrors: 'Please fix the errors below before continuing.',
  },
  Collaborators: {
    form: {
      companyName: 'Company Name (Organization)',
      primaryPhoneNumber: 'Primary phone number',
      email: 'Email Address',
      site: 'Your website link (optional)',
      location: 'Location',
    },
  },
};

const renderWizard = () => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <CollaboratorFormWizard />
    </NextIntlClientProvider>,
  );
};

describe('Collaborator Registration E2E Flow', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useCollaboratorFormStore.getState().reset();
    useCollaboratorFormStore.setState({ hasHydrated: true });
  });

  it('renders first step and prevents proceeding with invalid data', async () => {
    renderWizard();

    // Check if we are on step 1
    expect(await screen.findByText(/Company Info/i, {}, { timeout: 3000 })).toBeInTheDocument();

    // Click Next without filling anything
    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);

    // Should show validation errors (would be handled by UI, so we check store)
    await waitFor(() => {
      const state = useCollaboratorFormStore.getState();
      expect(Object.keys(state.errors).length).toBeGreaterThan(0);
      expect(state.currentStepIndex).toBe(0);
    });
  });

  it('persists data across step navigation (forward and back)', async () => {
    const user = userEvent.setup();
    renderWizard();

    // Fill minimum required on Step 1
    const companyInput = await screen.findByLabelText(/Company Name/i);
    await user.type(companyInput, 'Acme Corp');
    const phoneInput = await screen.findByLabelText(/Primary phone/i);
    await user.type(phoneInput, '+1234567890');
    const emailInput = await screen.findByLabelText(/Email Address/i);
    await user.type(emailInput, 'test@acme.com');

    // Store should update
    expect(useCollaboratorFormStore.getState().data.companyName).toBe(
      'Acme Corp',
    );

    // Click Next to navigate forward
    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);

    // Wait for step 2 (Industry Information)
    await waitFor(() => {
      expect(useCollaboratorFormStore.getState().currentStepIndex).toBe(1);
    });

    // Click Back to navigate backward
    const backBtn = await screen.findByRole('button', { name: /Previous|Back/i }); // Assuming there's a back button
    fireEvent.click(backBtn);

    // Data should still be there
    await waitFor(() => {
      expect(useCollaboratorFormStore.getState().data.companyName).toBe(
        'Acme Corp',
      );
      expect(useCollaboratorFormStore.getState().currentStepIndex).toBe(0);
    });
  });
});
