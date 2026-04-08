import React from 'react';
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
    step: 'company-info',
  }),
}));

const messages = {
  Collaborators: {
    form: {
      CompanyInfoTitle: 'Company Information',
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
      <CollaboratorFormWizard />
    </NextIntlClientProvider>
  );
};

describe('Collaborator Registration E2E Flow', () => {
  beforeEach(() => {
    useCollaboratorFormStore.getState().reset();
  });

  it('renders first step and prevents proceeding with invalid data', async () => {
    renderWizard();
    
    // Check if we are on step 1
    expect(screen.getByText(/Company Info/i)).toBeInTheDocument();
    
    // Click Next without filling anything
    const nextBtn = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextBtn);
    
    // Should show validation errors (would be handled by UI, so we check store)
    await waitFor(() => {
      const state = useCollaboratorFormStore.getState();
      expect(Object.keys(state.errors).length).toBeGreaterThan(0);
    });
  });

  it('persists data across step navigation (forward and back)', async () => {
    const user = userEvent.setup();
    renderWizard();

    // Fill minimum required on Step 1
    const companyInput = screen.getByLabelText(/Company Name/i);
    await user.type(companyInput, 'Acme Corp');

    // Store should update
    expect(useCollaboratorFormStore.getState().data.companyName).toBe('Acme Corp');

    // Simulate jumping to step 2 programmatically to bypass Zod requirements for this test
    useCollaboratorFormStore.getState().setStep(1); 
    
    // Then go back
    useCollaboratorFormStore.getState().setStep(0);
    
    // Data should still be there
    expect(useCollaboratorFormStore.getState().data.companyName).toBe('Acme Corp');
  });
});
