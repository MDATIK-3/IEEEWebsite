import FAQSection from './FAQSection';
import { getFaqs } from '@/lib/queries';

export const revalidate = 300;

export default async function FAQ() {
  const faqs = await getFaqs('general');

  return <FAQSection data={faqs} />;
}
