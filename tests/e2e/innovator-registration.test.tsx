import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
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
    back: jest.fn(),
  }),
  useParams: () => ({
    locale: 'en',
    step: '1',
  }),
  usePathname: () => '/en/innovators/registration',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
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
    nameRequired: 'Name is required',
    phoneRequired: 'Phone is required',
    InvalidPhoneNumber: 'Invalid phone number',
    emailRequired: 'Email is required',
    InvalidEmail: 'Invalid email address',
    countryRequired: 'Country is required',
    cityRequired: 'City is required',
    CityTooLong: 'City name too long',
    specializationRequired: 'Specialization is required',
    SpecializationTooLong: 'Specialization name too long',
    projectTitleRequired: 'Project title is required',
    projectDescriptionRequired: 'Project description is required',
    MaximumFieldSize: 'Field size exceeded',
    TermsOfUse: 'You must accept the terms',
  },
  Innovators: {
    form: {
      personalInfoTitle: 'Personal Information',
      personalInfoDescription: 'Tell us about yourself',
      basicInfo: 'Basic Info',
      basicInfoDesc: 'Your contact details',
      name: 'Full Name',
      phoneNumber: 'Phone Number',
      email: 'Email Address',
      country: 'Country',
      city: 'City / Address',
      specialization: 'Scientific Specialization',
      projectTitle: 'Project or Idea Title',
      projectDescription: 'Project Description',
      projectOverviewTitle: 'Project Overview',
      projectOverviewDescription: 'Tell us about your project',
      projectBasicInfo: 'Project Basic Info',
      projectBasicInfoDesc: 'General project details',
      projectDescriptionHint: 'Provide a detailed description of your project',
      objective: 'Objective',
      objectiveHint: 'What are you trying to achieve?',
      profileImage: 'Profile Image',
      profileImageDesc: 'Upload a clear profile photo',
      image: 'Profile Photo',
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

    const user = userEvent.setup();

    // Click Next without filling anything
    const nextBtn = await screen.findByRole('button', { name: /Next/i });
    await user.click(nextBtn);

    // Should show validation errors (would be handled by UI, so we check store)
    await waitFor(
      () => {
        const state = useInnovatorFormStore.getState();
        expect(state.isValidating).toBe(false);
        expect(Object.keys(state.errors).length).toBeGreaterThan(0);
        expect(state.currentStepIndex).toBe(0);
      },
      { timeout: 5000 },
    );
  });

  it('preserves data during navigation', async () => {
    renderWizard();

    const user = userEvent.setup();

    // Fill minimum required on Step 1
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
    await user.click(nextBtn);

    await waitFor(
      () => {
        expect(useInnovatorFormStore.getState().currentStepIndex).toBe(1);
      },
      { timeout: 5000 },
    );

    // Go back
    const backBtn = await screen.findByRole('button', {
      name: /Previous|Back/i,
    });
    await user.click(backBtn);
    await waitFor(
      () => {
        const state = useInnovatorFormStore.getState();
        expect(state.currentStepIndex).toBe(0);
        expect(state.data.name).toBe('John Doe');
      },
      { timeout: 5000 },
    );
  });
});
