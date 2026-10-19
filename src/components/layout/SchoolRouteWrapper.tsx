import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { NotFoundPage } from '@/pages/NotFoundPage';

/**
 * Layout wrapper that reads :schoolSlug from URL,
 * resolves it to a schoolId, and auto-sets it in Zustand.
 * All child routes inherit the school context.
 */
export function SchoolRouteWrapper() {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  const { setSchool, schoolConfigs } = useAppStore();

  const school = schoolConfigs.find(s => s.slug === schoolSlug);

  useEffect(() => {
    if (school) {
      setSchool(school.schoolId);
    }
  }, [school, setSchool]);

  if (!school) {
    return <NotFoundPage />;
  }

  return <Outlet />;
}
