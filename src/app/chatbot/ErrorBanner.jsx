export default function ErrorBanner({ error }) {
  return (
    <div className="border-b border-red-200 bg-red-50 px-6 py-3 dark:border-red-800 dark:bg-red-900/20">
      <p className="text-sm font-medium text-red-800 dark:text-red-200">Connection error: {error}</p>
    </div>
  );
}
