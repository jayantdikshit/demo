import { Outlet } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useSchoolSlug } from '@/hooks/useSchoolSlug';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Breadcrumbs } from './Breadcrumbs';
import { MobileNav } from './MobileNav';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

export function AppLayout() {
  const { currentRole } = useAppStore();
  const { schoolPath } = useSchoolSlug();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!currentRole) {
    return <Navigate to={schoolPath('/login')} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Nav */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <div className="md:ml-[260px] transition-all duration-300">
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />
        <Breadcrumbs />
        <main className="px-4 md:px-6 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
