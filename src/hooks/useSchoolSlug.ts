import { useParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';

/**
 * Hook to get the current school slug from URL params.
 * Returns slug and a helper to build school-scoped paths.
 */
export function useSchoolSlug() {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  const { schoolConfigs } = useAppStore();

  const currentSchool = schoolConfigs.find(s => s.slug === schoolSlug);
  const slug = currentSchool?.slug || schoolSlug || 'vps';

  /** Build a path scoped to the current school, e.g. schoolPath('/student/dashboard') → '/school/vps/student/dashboard' */
  const schoolPath = (path: string) => `/school/${slug}${path}`;

  return { schoolSlug: slug, currentSchool, schoolPath };
}
