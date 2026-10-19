import { useNavigate, type NavigateOptions, type To } from 'react-router-dom';
import { useSchoolSlug } from './useSchoolSlug';

/**
 * Drop-in replacement for useNavigate() that auto-prepends /school/:slug.
 * Use exactly like useNavigate: const navigate = useSchoolNavigate();
 * - navigate('/student/dashboard') → navigates to /school/vps/student/dashboard
 * - navigate(-1) → history back
 * - navigate('/school/sia/login') → retains explicit school path without double prefix
 */
export function useSchoolNavigate() {
  const navigate = useNavigate();
  const { schoolPath } = useSchoolSlug();

  return (to: To | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      return navigate(to);
    }
    if (typeof to === 'string') {
      if (to.startsWith('/school/') || to.startsWith('http://') || to.startsWith('https://')) {
        return navigate(to, options);
      }
      return navigate(schoolPath(to), options);
    }
    return navigate(to, options);
  };
}
