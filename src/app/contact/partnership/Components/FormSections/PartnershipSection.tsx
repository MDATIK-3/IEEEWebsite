import { Handshake } from 'lucide-react';
import SectionHeader from './SectionHeader';
import InputField from '../Form/InputField';
import SelectField from '../Form/SelectField';
import TextareaField from '../Form/TextareaField';

interface FormData {
    partnershipType: string;
    projectDescription: string;
    duration: string;
    budget: string;
    objectives: string;
    benefits: string;
    timeline: string;
    additionalInfo: string;
    [key: string]: string;
}

interface Errors {
    [key: string]: string;
}

interface PartnershipSectionProps {
    formData: FormData;
    errors: Errors;
    focusedField: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleFocus: (fieldName: string) => void;
    handleBlur: (fieldName: string) => void;
    partnershipTypes: { value: string; label: string }[];
}

const PartnershipSection: React.FC<PartnershipSectionProps> = ({
    formData,
    errors,
    focusedField,
    handleChange,
    handleFocus,
    handleBlur,
    partnershipTypes,
}) => (
    <div className="space-y-6">
        <SectionHeader title="Partnership Details" />
        <SelectField
            name="partnershipType"
            label="Partnership Type"
            required
            placeholder="Select partnership type"
            options={partnershipTypes}
            icon={Handshake}
            value={formData.partnershipType}
            onChange={handleChange}
            onFocus={() => handleFocus('partnershipType')}
            onBlur={() => handleBlur('partnershipType')}
            error={errors.partnershipType}
            focused={focusedField === 'partnershipType'}
        />
        <TextareaField
            name="projectDescription"
            label="Project/Initiative Description"
            required
            placeholder="Describe the project, event, or initiative you'd like to collaborate on. Include goals, scope, and expected outcomes."
            rows={5}
            value={formData.projectDescription}
            onChange={handleChange}
            onFocus={() => handleFocus('projectDescription')}
            onBlur={() => handleBlur('projectDescription')}
            error={errors.projectDescription}
            focused={focusedField === 'projectDescription'}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
                name="duration"
                label="Expected Duration"
                placeholder="e.g., 3 months, 1 year, ongoing"
                value={formData.duration}
                onChange={handleChange}
                onFocus={() => handleFocus('duration')}
                onBlur={() => handleBlur('duration')}
                error={errors.duration}
                focused={focusedField === 'duration'}
            />
            <InputField
                name="budget"
                label="Budget Range (Optional)"
                placeholder="e.g., $5,000 - $10,000"
                value={formData.budget}
                onChange={handleChange}
                onFocus={() => handleFocus('budget')}
                onBlur={() => handleBlur('budget')}
                error={errors.budget}
                focused={focusedField === 'budget'}
            />
        </div>
        <TextareaField
            name="objectives"
            label="Partnership Objectives"
            required
            placeholder="What do you hope to achieve through this partnership? What are your main goals?"
            rows={4}
            value={formData.objectives}
            onChange={handleChange}
            onFocus={() => handleFocus('objectives')}
            onBlur={() => handleBlur('objectives')}
            error={errors.objectives}
            focused={focusedField === 'objectives'}
        />
        <TextareaField
            name="benefits"
            label="Mutual Benefits"
            placeholder="How will this partnership benefit both your organization and IEEE GUB?"
            rows={4}
            value={formData.benefits}
            onChange={handleChange}
            onFocus={() => handleFocus('benefits')}
            onBlur={() => handleBlur('benefits')}
            error={errors.benefits}
            focused={focusedField === 'benefits'}
        />
        <TextareaField
            name="timeline"
            label="Proposed Timeline"
            placeholder="When would you like to start? Any important dates or deadlines?"
            rows={3}
            value={formData.timeline}
            onChange={handleChange}
            onFocus={() => handleFocus('timeline')}
            onBlur={() => handleBlur('timeline')}
            error={errors.timeline}
            focused={focusedField === 'timeline'}
        />
        <TextareaField
            name="additionalInfo"
            label="Additional Information"
            placeholder="Any other details you'd like to share about your organization or this partnership proposal?"
            rows={4}
            value={formData.additionalInfo}
            onChange={handleChange}
            onFocus={() => handleFocus('additionalInfo')}
            onBlur={() => handleBlur('additionalInfo')}
            error={errors.additionalInfo}
            focused={focusedField === 'additionalInfo'}
        />
    </div>
);

export default PartnershipSection;