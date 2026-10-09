import { Users, Mail, Phone, Globe } from 'lucide-react';
import SectionHeader from './SectionHeader';
import InputField from '../Form/InputField';

interface FormData {
    contactPerson: string;
    email: string;
    phone: string;
    website: string;
    [key: string]: string;
}

interface Errors {
    [key: string]: string;
}

interface ContactSectionProps {
    formData: FormData;
    errors: Errors;
    focusedField: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleFocus: (fieldName: string) => void;
    handleBlur: (fieldName: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({
    formData,
    errors,
    focusedField,
    handleChange,
    handleFocus,
    handleBlur,
}) => (
    <div className="space-y-6">
        <SectionHeader title="Contact Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
                name="contactPerson"
                label="Contact Person"
                required
                placeholder="Full name of contact person"
                icon={Users}
                value={formData.contactPerson}
                onChange={handleChange}
                onFocus={() => handleFocus('contactPerson')}
                onBlur={() => handleBlur('contactPerson')}
                error={errors.contactPerson}
                focused={focusedField === 'contactPerson'}
            />
            <InputField
                name="email"
                label="Email Address"
                type="email"
                required
                placeholder="contact@yourorganization.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
                error={errors.email}
                focused={focusedField === 'email'}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
                name="phone"
                label="Phone Number"
                placeholder="+880 1XXX-XXXXXX"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => handleFocus('phone')}
                onBlur={() => handleBlur('phone')}
                error={errors.phone}
                focused={focusedField === 'phone'}
            />
            <InputField
                name="website"
                label="Organization Website"
                placeholder="https://yourorganization.com"
                icon={Globe}
                value={formData.website}
                onChange={handleChange}
                onFocus={() => handleFocus('website')}
                onBlur={() => handleBlur('website')}
                error={errors.website}
                focused={focusedField === 'website'}
            />
        </div>
    </div>
);

export default ContactSection;