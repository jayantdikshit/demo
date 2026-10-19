import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { useSchoolSlug } from '@/hooks/useSchoolSlug';
import { GraduationCap, ArrowRight } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const { getSchoolConfig } = useAppStore();
  const { schoolPath } = useSchoolSlug();
  const schoolConfig = getSchoolConfig();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{schoolConfig.logo}</span>
          <div>
            <span className="font-extrabold text-gray-900 text-lg leading-tight block">
              {schoolConfig.name}
            </span>
            <span className="text-[11px] text-gray-500 font-medium">Excellence in Education</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          <a href="#academics" className="hover:text-blue-600 transition-colors">Academics</a>
          <a href="#admissions" className="hover:text-blue-600 transition-colors">Admissions</a>
          <a href="#facilities" className="hover:text-blue-600 transition-colors">Campus</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to={schoolPath('/login')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 shadow-sm transition-all"
          >
            <span>ERP Portal</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
};

export const PublicFooter: React.FC = () => {
  const { getSchoolConfig } = useAppStore();
  const { schoolPath } = useSchoolSlug();
  const schoolConfig = getSchoolConfig();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{schoolConfig.logo}</span>
              <span className="text-white font-bold text-base">{schoolConfig.name}</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{schoolConfig.tagline}</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-white">About School</a></li>
              <li><a href="#admissions" className="hover:text-white">Admissions 2026-27</a></li>
              <li><a href="#academics" className="hover:text-white">Curriculum & Pedagogy</a></li>
              <li><a href="#calendar" className="hover:text-white">Academic Calendar</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Contact</h4>
            <p className="text-xs text-gray-400">123 Knowledge Parkway, City Campus</p>
            <p className="text-xs text-gray-400 mt-1">admissions@{schoolConfig.domain}</p>
            <p className="text-xs text-gray-400 mt-1">+91 98765 43210</p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Digital Platform</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Powered by EduPulse Digital Intelligence ERP.
            </p>
            <Link
              to={schoolPath('/login')}
              className="inline-block px-3 py-1.5 rounded-lg bg-gray-800 text-blue-400 text-xs font-semibold hover:bg-gray-700 transition-colors"
            >
              Staff & Student Login →
            </Link>
          </div>
        </div>
        <div className="pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {schoolConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
