import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InnovatorFormWizard } from '@/features/innovators/components/innovator-form-wizard';
import { useInnovatorFormStore } from '@/features/innovators/store';
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
  const ActualComponent = ({ children, ...props }: any) =>
    React.createElement('div', props, children);
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
    AnimatePresence: ({ children }: any) =>
      React.createElement(React.Fragment, {}, children),
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
  Innovators: {
    form: {
      name: 'Full Name',
      phoneNumber: 'Phone Number',
      email: 'Email Address',
      country: 'Country',
      city: 'City / Address',
      specialization: 'Scientific Specialization',
      projectTitle: 'Project or Idea Title',
      projectDescription: 'Project Description',
    },
  },
};

const renderWizard = () => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <InnovatorFormWizard />
    </NextIntlClientProvider>,
  );
};

describe('Innovator Registration E2E Flow', () => {
  beforeEach(() => {
    sessionStorage.clear();
    useInnovatorFormStore.getState().reset();
    useInnovatorFormStore.setState({ hasHydrated: true });
  });

  it('should render the first step and block navigation if invalid', async () => {
    renderWizard();

    // Click Next without filling anything
    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      const state = useInnovatorFormStore.getState();
      expect(Object.keys(state.errors).length).toBeGreaterThan(0);
      expect(state.currentStepIndex).toBe(0); // Should not advance
    });
  });

  it('preserves data during navigation', async () => {
    const user = userEvent.setup();
    renderWizard();

    // Fill required fields
    const nameInput = await screen.findByLabelText(
      /Full Name/i,
      {},
      { timeout: 3000 },
    );
    await user.type(nameInput, 'John Doe');
    const phoneInput = await screen.findByLabelText(/Phone Number/i);
    await user.type(phoneInput, '+1234567890');
    const emailInput = await screen.findByLabelText(/Email Address/i);
    await user.type(emailInput, 'john@example.com');
    const countryInput = await screen.findByLabelText(/Country/i);
    await user.type(countryInput, 'Libya');
    const cityInput = await screen.findByLabelText(/City \/ Address/i);
    await user.type(cityInput, 'Tripoli');
    const specInput = await screen.findByLabelText(/Specialization/i);
    await user.type(specInput, 'AI Engineering');

    expect(useInnovatorFormStore.getState().data.name).toBe('John Doe');

    // Click Next
    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(useInnovatorFormStore.getState().currentStepIndex).toBe(1);
    });

    // Go back
    const backBtn = screen.queryByRole('button', {
      name: /Previous|Back/i,
    });
    if (backBtn) {
      fireEvent.click(backBtn);
      await waitFor(() => {
        expect(useInnovatorFormStore.getState().currentStepIndex).toBe(0);
        expect(useInnovatorFormStore.getState().data.name).toBe('John Doe');
      });
    }
  });
});
