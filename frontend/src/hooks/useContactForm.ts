import { useState, FormEvent } from 'react';
import { api } from '../services/api';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface UseContactForm {
  formData: FormData;
  status: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
}

const EMPTY_FORM: FormData = { name: '', email: '', message: '' };

/**
 * Owns all contact form state and submit logic, completely out of App.tsx.
 */
export const useContactForm = (): UseContactForm => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('TRANSMITTING...');
    try {
      await api.submitContact(formData);
      setStatus('DATA UPLOADED.');
      setFormData(EMPTY_FORM);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'CONNECTION SEVERED.';
      setStatus(message);
    }
  };

  return { formData, status, handleChange, handleSubmit };
};
