import { useState } from 'react';
import { useToast } from '../contact/Components/ToastProvider';

export const useContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formTouched, setFormTouched] = useState({});
  const [status, setStatus] = useState({
    isSending: false,
    isSuccess: false,
    errorMessage: '',
    focusedField: ''
  });

  const { showToast } = useToast();

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getFieldError = (field) => {
    if (!formTouched[field]) return null;
    if (field === 'name') return formData.name.length < 2 ? 'Name must be at least 2 characters' : null;
    if (field === 'email') {
      if (!formData.email) return 'Email is required';
      if (!isEmailValid(formData.email)) return 'Please enter a valid email address';
      return null;
    }
    if (field === 'subject') return formData.subject.length < 3 ? 'Subject must be at least 3 characters' : null;
    if (field === 'message') return formData.message.length < 10 ? 'Message must be at least 10 characters long' : null;
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (!formTouched[name]) {
      setFormTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFormTouched((prev) => ({ ...prev, [name]: true }));
  };

  const setFocusedField = (field) => {
    setStatus((prev) => ({ ...prev, focusedField: field }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormTouched({ name: true, email: true, subject: true, message: true });

    if (['name', 'email', 'subject', 'message'].some((f) => getFieldError(f))) return;

    setStatus((prev) => ({ ...prev, isSending: true, errorMessage: '' }));

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({ isSending: false, isSuccess: true, errorMessage: '', focusedField: '' });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setFormTouched({});
        setTimeout(() => setStatus((prev) => ({ ...prev, isSuccess: false })), 5000);
        showToast('Message sent successfully!', 'success');
      } else {
        const error = await response.json();
        const msg = error.message || 'Something went wrong. Please try again.';
        setStatus((prev) => ({ ...prev, errorMessage: msg }));
        showToast(msg, 'error');
      }
    } catch {
      const msg = 'Network error. Please check your connection and try again.';
      setStatus((prev) => ({ ...prev, errorMessage: msg }));
      showToast(msg, 'error');
    } finally {
      setStatus((prev) => ({ ...prev, isSending: false }));
    }
  };

  return {
    formData,
    handleChange,
    handleBlur,
    setFocusedField,
    getFieldError,
    handleSubmit,
    ...status
  };
};
