'use client';

import { useState, useCallback } from 'react';
import Header from './Components/Header';
import PartnershipBenefits from './Components/PartnershipBenefits';
import FormHeader from './Components/Form/FormHeader';
import FormFooter from './Components/FormFooter';
import OrganizationSection from './Components/FormSections/OrganizationSection';
import ContactSection from './Components/FormSections/ContactSection';
import PartnershipSection from './Components/FormSections/PartnershipSection';
import ErrorMessage from './Components/FormSections/ErrorMessage';
import SubmitButton from './Components/FormSections/SubmitButton';
import SuccessMessage from './Components/FormSections/SuccessMessage';
import organizationTypes from '@/data/CollaborationForm/organizationTypes.json';
import partnershipTypes from '@/data/CollaborationForm/partnershipTypes.json';

interface FormData {
    organizationName: string;
    organizationType: string;
    contactPerson: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    partnershipType: string;
    projectDescription: string;
    duration: string;
    budget: string;
    objectives: string;
    benefits: string;
    timeline: string;
    additionalInfo: string;
}

interface Errors {
    [key: string]: string;
}

const PartnershipPage = () => {
    const [formData, setFormData] = useState<FormData>({
        organizationName: '',
        organizationType: '',
        contactPerson: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        partnershipType: '',
        projectDescription: '',
        duration: '',
        budget: '',
        objectives: '',
        benefits: '',
        timeline: '',
        additionalInfo: '',
    });

    const [errors, setErrors] = useState<Errors>({});
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const validateField = useCallback(
        (name: string, value: string): string => {
            switch (name) {
                case 'organizationName':
                    return !value.trim() ? 'Organization name is required' : '';
                case 'organizationType':
                    return !value ? 'Please select organization type' : '';
                case 'contactPerson':
                    return !value.trim() ? 'Contact person name is required' : '';
                case 'email':
                    if (!value.trim()) return 'Email is required';
                    return !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email address' : '';
                case 'phone':
                    if (value && !/^\+?[\d\s-]{7,}$/.test(value))
                        return 'Please enter a valid phone number';
                    return '';
                case 'website':
                    if (value && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(value))
                        return 'Please enter a valid URL';
                    return '';
                case 'partnershipType':
                    return !value ? 'Please select partnership type' : '';
                case 'projectDescription':
                    if (!value.trim()) return 'Project description is required';
                    return value.length < 50
                        ? 'Please provide a more detailed description (minimum 50 characters)'
                        : '';
                case 'objectives':
                    return !value.trim() ? 'Partnership objectives are required' : '';
                default:
                    return '';
            }
        },
        []
    );

    const validateForm = useCallback((): boolean => {
        const newErrors: Errors = {};
        (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, validateField]);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
            setErrors((prev) => ({ ...prev, [name]: '' }));
        },
        []
    );

    const handleFocus = useCallback((fieldName: string) => {
        setFocusedField(fieldName);
    }, []);

    const handleBlur = useCallback(
        (fieldName: string) => {
            setFocusedField(null);
            const error = validateField(fieldName, formData[fieldName as keyof FormData]);
            if (error) {
                setErrors((prev) => ({ ...prev, [fieldName]: error }));
            }
        },
        [formData, validateField]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');

        try {
            const response = await fetch('/api/partnership', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            let result;
            try {
                result = await response.json();
            } catch (error) {
                throw new Error('Invalid response from server');
            }

            if (response.ok) {
                setIsSuccess(true);
                setFormData({
                    organizationName: '',
                    organizationType: '',
                    contactPerson: '',
                    email: '',
                    phone: '',
                    website: '',
                    address: '',
                    partnershipType: '',
                    projectDescription: '',
                    duration: '',
                    budget: '',
                    objectives: '',
                    benefits: '',
                    timeline: '',
                    additionalInfo: '',
                });
                setErrors({});
            } else {
                setSubmitError(result.message || 'Failed to submit application');
            }
        } catch (error) {
            setSubmitError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setIsSuccess(false);
        setErrors({});
    };

    if (isSuccess) {
        return <SuccessMessage onReset={handleReset} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900/20">
            <Header />
            <PartnershipBenefits />
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
                        <FormHeader />
                        <form onSubmit={handleSubmit} className="space-y-8 ">
                            <OrganizationSection
                                formData={formData}
                                errors={errors}
                                focusedField={focusedField}
                                handleChange={handleChange}
                                handleFocus={handleFocus}
                                handleBlur={handleBlur}
                                organizationTypes={organizationTypes}
                            />
                            <ContactSection
                                formData={formData}
                                errors={errors}
                                focusedField={focusedField}
                                handleChange={handleChange}
                                handleFocus={handleFocus}
                                handleBlur={handleBlur}
                            />
                            <PartnershipSection
                                formData={formData}
                                errors={errors}
                                focusedField={focusedField}
                                handleChange={handleChange}
                                handleFocus={handleFocus}
                                handleBlur={handleBlur}
                                partnershipTypes={partnershipTypes}
                            />
                            {submitError && <ErrorMessage message={submitError} />}
                            <SubmitButton isSubmitting={isSubmitting} />
                            <FormFooter />
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PartnershipPage;