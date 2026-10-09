import executiveData from '@/data/executiveData.json';
import ExecutivesClient from './ExecutivesClient';

const ExecutivePage = () => {
  return <ExecutivesClient executiveData={executiveData} />;
};

export default ExecutivePage;
