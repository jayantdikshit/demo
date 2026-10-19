import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

export function PlaceholderPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageName = pathParts[pathParts.length - 1] || 'Page';
  const title = pageName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const section = pathParts[0]?.charAt(0).toUpperCase() + pathParts[0]?.slice(1);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
        <Construction size={36} className="text-amber-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-500 mb-1">{section} Module</p>
      <p className="text-gray-400 text-sm max-w-md">
        This page will be built in the upcoming development phases. The navigation and routing are ready.
      </p>
      <div className="mt-6 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-xs font-medium">
        🚧 Coming in Phase 3–7
      </div>
    </div>
  );
}
