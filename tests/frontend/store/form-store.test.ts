import { createFormStore } from '@/lib/forms/create-form-store';

describe('createFormStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  const useTestStore = createFormStore<{ name: string; age?: number }>({
    storageKey: 'test-form-storage',
    version: 1,
  });

  it('should initialize with default state', () => {
    const state = useTestStore.getState();
    expect(state.currentStepIndex).toBe(0);
    expect(state.data).toEqual({});
    expect(state.errors).toEqual({});
    expect(state.isSubmitting).toBe(false);
    expect(state.isValidating).toBe(false);
    expect(state.metadata.version).toBe(1);
  });

  it('should update current step', () => {
    useTestStore.getState().setStep(2);
    expect(useTestStore.getState().currentStepIndex).toBe(2);
  });

  it('should update data and clear field errors', () => {
    // Set initial errors
    useTestStore.getState().setErrors({ name: 'Required', age: 'Invalid' });

    // Update data for 'name'
    useTestStore.getState().setData({ name: 'John' });

    const state = useTestStore.getState();
    expect(state.data).toEqual({ name: 'John' });
    
    // Error for 'name' should be cleared, but 'age' should remain
    expect(state.errors).toEqual({ age: 'Invalid' });
  });

  it('should completely reset store on reset()', () => {
    useTestStore.getState().setData({ name: 'John' });
    useTestStore.getState().setStep(1);
    
    useTestStore.getState().reset();
    
    const state = useTestStore.getState();
    expect(state.currentStepIndex).toBe(0);
    expect(state.data).toEqual({});
  });

  it('should set submitting and validating states', () => {
    useTestStore.getState().setSubmitting(true);
    useTestStore.getState().setValidating(true);

    const state = useTestStore.getState();
    expect(state.isSubmitting).toBe(true);
    expect(state.isValidating).toBe(true);
  });
});
