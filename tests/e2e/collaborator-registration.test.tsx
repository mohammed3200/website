import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollaboratorFormWizard } from '@/features/collaborators/components/collaborator-form-wizard';
import { useCollaboratorFormStore } from '@/features/collaborators/store';
import { NextIntlClientProvider } from 'next-intl';
import { mock, jest, describe, it, expect, beforeEach } from 'bun:test';

// Mock next/navigation
mock.module('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({
    locale: 'en',
    step: '1',
  }),
  usePathname: () => '/en/collaborators/registration',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock framer-motion
mock.module('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const messages = {
  Common: {
    next: 'Next',
    back: 'Back',
    submit: 'Submit Application',
    navigation: 'Navigation',
    submitting: 'Submitting',
    validating: 'Validating',
  },
  Validation: {
    RequiredField: 'This field is required',
    validationError: 'Validation Error',
    pleaseFixErrors: 'Please fix the errors below before continuing.',
    companyNameRequired: 'Company name is required',
    primaryPhoneRequired: 'Primary phone is required',
    emailRequired: 'Email is required',
    InvalidPhoneNumber: 'Invalid phone number',
    InvalidEmail: 'Invalid email address',
    InvalidURL: 'Invalid URL',
    industrialSectorRequired: 'Industrial sector is required',
    specializationRequired: 'Specialization is required',
    InvalidMediaType: 'Invalid media type',
    InvalidFileSize: 'File too large',
    TermsOfUse: 'You must accept the terms',
  },
  Collaborators: {
    form: {
      companyName: 'Company Name (Organization)',
      companyNamePlaceholder: 'Enter company name',
      primaryPhoneNumber: 'Primary phone number',
      optionalPhoneNumber: 'Optional phone number',
      optional: 'Optional',
      email: 'Email Address',
      site: 'Your website link (optional)',
      location: 'Location',
      locationDescription: 'Enter company address',
      contactDetails: 'Contact Details',
      howToReach: 'How to reach you',
      branding: 'Branding',
      uploadLogoDesc: 'Upload your company logo',
      image: 'Company Logo',
      industrialSector: 'Industrial Sector',
      selectSector: 'Select a sector',
      specialization: 'Specialization',
      specializationDescription: 'Enter your specialization',
    },
  },
  Enums: {
    IndustrialSectors: {
      Energy: 'Energy',
      Technology: 'Technology',
      Manufacturing: 'Manufacturing',
      Food: 'Food',
      Other: 'Other',
    },
  },
  FileUpload: {
    dropHere: 'Drop files here',
    clickOrDrag: 'Click or drag files to upload',
  },
  Navigation: {
    incubator: 'Incubator',
    entrepreneurshipCenter: 'Entrepreneurship Center',
  },
};

const renderWizard = () => {
  return render(
    <NextIntlClientProvider
      locale="en"
      messages={messages}
      onError={() => {}}
      getMessageFallback={({ key }) => key}
    >
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
    const user = userEvent.setup();
    renderWizard();

    // Click Next without filling anything
    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    await user.click(nextBtn);

    // Should show validation errors (would be handled by UI, so we check store)
    await waitFor(
      () => {
        const state = useCollaboratorFormStore.getState();
        // Validation must be finished and errors should be present
        expect(state.isValidating).toBe(false);
        expect(Object.keys(state.errors).length).toBeGreaterThan(0);
        expect(state.currentStepIndex).toBe(0);
      },
      { timeout: 5000 },
    );
  });

  it('persists data across step navigation (forward and back)', async () => {
    const user = userEvent.setup();
    renderWizard();

    // Fill minimum required on Step 1 — use IDs to avoid cross-test selector issues
    await waitFor(() => {
      expect(document.getElementById('companyName')).not.toBeNull();
    }, { timeout: 5000 });
    const companyInput = document.getElementById('companyName') as HTMLInputElement;
    await user.type(companyInput, 'Tech Corp');
    const phoneInput = document.getElementById('primaryPhoneNumber') as HTMLInputElement;
    await user.type(phoneInput, '+1234567890');
    const emailInput = document.getElementById('email') as HTMLInputElement;
    await user.type(emailInput, 'test@acme.com');

    // Store should update
    expect(useCollaboratorFormStore.getState().data.companyName).toBe(
      'Tech Corp',
    );

    // Click Next to navigate forward
    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    await user.click(nextBtn);

    await waitFor(
      () => {
        const state = useCollaboratorFormStore.getState();
        expect(state.currentStepIndex).toBe(1);
      },
      { timeout: 5000 },
    );

    // Click Back to navigate backward
    const backBtn = await screen.findByRole('button', {
      name: /Previous|Back/i,
    });
    await user.click(backBtn);

    // Data should still be there
    await waitFor(
      () => {
        const state = useCollaboratorFormStore.getState();
        expect(state.currentStepIndex).toBe(0);
        expect(state.data.companyName).toBe('Tech Corp');
      },
      { timeout: 5000 },
    );
  });
});
