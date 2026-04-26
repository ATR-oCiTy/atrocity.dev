import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import sinon from 'sinon';
import { renderHook, act } from '@testing-library/react';
import { useContactForm } from '../src/hooks/useContactForm';
import { api } from '../src/services/api';

describe('useContactForm Hook Unit Tests', () => {
  let submitStub: sinon.SinonStub;

  beforeEach(() => {
    // Arrange: Stub the API call
    submitStub = sinon.stub(api, 'submitContact');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should initialize with empty form data and status', () => {
    // Act
    const { result } = renderHook(() => useContactForm());

    // Assert
    expect(result.current.formData).to.deep.equal({ name: '', email: '', message: '' });
    expect(result.current.status).to.equal('');
  });

  it('should update formData when handleChange is called', () => {
    // Arrange
    const { result } = renderHook(() => useContactForm());
    const mockEvent = {
      target: { name: 'email', value: 'test@example.com' }
    } as React.ChangeEvent<HTMLInputElement>;

    // Act
    act(() => {
      result.current.handleChange(mockEvent);
    });

    // Assert
    expect(result.current.formData.email).to.equal('test@example.com');
    expect(result.current.formData.name).to.equal(''); // Remains unchanged
  });

  it('should set status to DATA UPLOADED and clear form on successful submit', async () => {
    // Arrange
    const { result } = renderHook(() => useContactForm());
    submitStub.resolves({ message: 'Success' });
    
    const mockSubmitEvent = { preventDefault: sinon.spy() } as any;

    // Fill the form first
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: 'John' } } as any);
      result.current.handleChange({ target: { name: 'email', value: 'john@example.com' } } as any);
      result.current.handleChange({ target: { name: 'message', value: 'Hello' } } as any);
    });

    // Act
    await act(async () => {
      await result.current.handleSubmit(mockSubmitEvent);
    });

    // Assert
    expect(mockSubmitEvent.preventDefault.calledOnce).to.be.true;
    expect(submitStub.calledOnceWithExactly({
      name: 'John',
      email: 'john@example.com',
      message: 'Hello'
    })).to.be.true;
    expect(result.current.status).to.equal('DATA UPLOADED.');
    expect(result.current.formData).to.deep.equal({ name: '', email: '', message: '' });
  });

  it('should set status to error message on API failure', async () => {
    // Arrange
    const { result } = renderHook(() => useContactForm());
    const errorMsg = 'Invalid email address';
    submitStub.rejects(new Error(errorMsg));
    
    const mockSubmitEvent = { preventDefault: sinon.spy() } as any;

    // Act
    await act(async () => {
      await result.current.handleSubmit(mockSubmitEvent);
    });

    // Assert
    expect(submitStub.calledOnce).to.be.true;
    expect(result.current.status).to.equal(errorMsg);
    // Form should NOT be cleared on failure
    expect(result.current.formData).to.deep.equal({ name: '', email: '', message: '' });
  });
});
