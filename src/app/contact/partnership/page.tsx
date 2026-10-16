import { getOrganizationTypes, getPartnershipTypes } from '@/lib/queries';
import PartnershipForm from './PartnershipForm';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Partner With Us',
  description:
    'Collaborate with IEEE GUB. Submit a partnership proposal to work with the IEEE Student Branch at Green University of Bangladesh on events and initiatives.',
  path: '/contact/partnership',
});

// Lookups change rarely; mirror the cached getters' window. Admin writes call
// revalidateTag(TAGS.formOptions) to refresh instantly.
export const revalidate = 86400;

type Option = { value: string; label: string };
const toOptions = (rows: Array<{ value: string; label: string }>): Option[] =>
  rows.map((o) => ({ value: o.value, label: o.label }));

const PartnershipPage = async () => {
  const [organizationTypes, partnershipTypes] = await Promise.all([
    getOrganizationTypes(),
    getPartnershipTypes(),
  ]);

  return (
    <PartnershipForm
      organizationTypes={toOptions(organizationTypes)}
      partnershipTypes={toOptions(partnershipTypes)}
    />
  );
};

export default PartnershipPage;
