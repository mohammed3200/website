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
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    nav: ({ children, ...props }: any) => <nav {...props}>{children}</nav>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useAnimation: () => ({ start: jest.fn(), stop: jest.fn(), set: jest.fn() }),
  useInView: () => [null, true],
}));

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
    </NextIntlClientProvider>
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
    const nameInput = await screen.findByLabelText(/Full Name/i);
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
    const backBtn = await screen.findByRole('button', { name: /Previous|Back/i });
    if (backBtn) {
       fireEvent.click(backBtn);
       await waitFor(() => {
          expect(useInnovatorFormStore.getState().currentStepIndex).toBe(0);
          expect(useInnovatorFormStore.getState().data.name).toBe('John Doe');
       });
    }
  });
});
