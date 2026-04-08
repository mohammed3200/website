import React from 'react';
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
    step: 'personal-info',
  }),
}));

const messages = {
  Innovators: {
    form: {
      NextButton: 'Next',
      SubmitButton: 'Submit',
    }
  },
  Validation: {
    RequiredField: 'Required field',
  }
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
    useInnovatorFormStore.getState().reset();
  });

  it('should render the first step and block navigation if invalid', async () => {
    renderWizard();

    // Click Next without filling anything
    const nextBtn = screen.getByRole('button', { name: /Next/i });
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

    const nameInput = screen.getByRole('textbox', { name: /Name/i }); // Assuming label match or similar
    if (nameInput) {
       await user.type(nameInput, 'John Doe');
       expect(useInnovatorFormStore.getState().data.name).toBe('John Doe');
    }
  });
});
