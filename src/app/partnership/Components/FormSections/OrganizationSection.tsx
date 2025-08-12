import { Building2 } from 'lucide-react';
import SectionHeader from './SectionHeader';
import InputField from '../Form/InputField';
import SelectField from '../Form/SelectField';
import TextareaField from '../Form/TextareaField';

interface FormData {
    organizationName: string;
    organizationType: string;
    address: string;
    [key: string]: string;
}

interface Errors {
    [key: string]: string;
}

interface OrganizationSectionProps {
    formData: FormData;
    errors: Errors;
    focusedField: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleFocus: (fieldName: string) => void;
    handleBlur: (fieldName: string) => void;
    organizationTypes: { value: string; label: string; }[];
}

const OrganizationSection: React.FC<OrganizationSectionProps> = ({
    formData,
    errors,
    focusedField,
    handleChange,
    handleFocus,
    handleBlur,
    organizationTypes,
}) => (
    <div className="space-y-6">
        <SectionHeader title="Organization Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
                name="organizationName"
                label="Organization Name"
                required
                placeholder="Enter your organization name"
                icon={Building2}
                value={formData.organizationName}
                onChange={handleChange}
                onFocus={() => handleFocus('organizationName')}
                onBlur={() => handleBlur('organizationName')}
                error={errors.organizationName}
                focused={focusedField === 'organizationName'}
            />
            <SelectField
                name="organizationType"
                label="Organization Type"
                required
                placeholder="Select organization type"
                options={organizationTypes}
                icon={Building2}
                value={formData.organizationType}
                onChange={handleChange}
                onFocus={() => handleFocus('organizationType')}
                onBlur={() => handleBlur('organizationType')}
                error={errors.organizationType}
                focused={focusedField === 'organizationType'}
            />
        </div>
        <TextareaField
            name="address"
            label="Organization Address"
            placeholder="Enter your organization's full address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            onFocus={() => handleFocus('address')}
            onBlur={() => handleBlur('address')}
            error={errors.address}
            focused={focusedField === 'address'}
        />
    </div>
);

export default OrganizationSection;