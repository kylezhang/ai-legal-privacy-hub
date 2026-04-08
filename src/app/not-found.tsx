import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 dark:bg-slate-950">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase italic">404 - Page Not Found</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-8 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all uppercase tracking-widest text-sm"
      >
        Go Home
      </Link>
    </div>
  );
}
