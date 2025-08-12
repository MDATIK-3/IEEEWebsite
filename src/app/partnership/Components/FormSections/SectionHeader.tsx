interface SectionHeaderProps {
    title: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
        {title}
    </h3>
);

export default SectionHeader;