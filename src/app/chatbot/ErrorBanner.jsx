export default function ErrorBanner({ error }) {
  return (
    <div className="px-6 py-3 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
      <p className="text-sm text-red-800 dark:text-red-200">
        ⚠️ Connection error: {error}
      </p>
    </div>
  );
}
