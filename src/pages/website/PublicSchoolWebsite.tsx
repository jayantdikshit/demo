import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchoolData } from '@/hooks/useSchoolData';
import { useAppStore } from '@/store/useAppStore';
import { useSchoolSlug } from '@/hooks/useSchoolSlug';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Card, CardContent } from '@/components/common/Card';
import { formatCurrency } from '@/lib/utils';
import {
  School,
  GraduationCap,
  Users,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Monitor,
  FlaskConical,
  Laptop,
  Bus,
  Search,
  ChevronRight,
  ExternalLink,
  Download,
  Send,
  Eye,
  ShieldCheck,
  Star,
  Globe,
  Menu,
  X,
  Award,
  Heart,
  Quote,
} from 'lucide-react';
import type { WebsiteContent, WebsiteNotice, WebsiteEvent, WebsiteAchievement, WebsiteFacility, SchoolConfig } from '@/types';

// ── 2025-26 Board Toppers & Star Achievers Data ──
interface BoardTopper {
  id: string;
  name: string;
  photo: string;
  class: string;
  rollNo: string;
  category: 'class10' | 'class12_science' | 'class12_commerce' | 'olympiad' | 'sports' | 'arts';
  title: string;
  score: string;
  subjectsBreakdown: string;
  quote: string;
  badge: string;
}

const boardToppersData: BoardTopper[] = [
  {
    id: 'top-1',
    name: 'Ananya Sen',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    class: 'Class 10-A',
    rollNo: 'Roll #1001',
    category: 'class10',
    title: 'CBSE Class 10 District Rank #1 & Gold Medalist',
    score: '99.4% (497/500)',
    subjectsBreakdown: 'Mathematics: 100/100 • Science: 100/100 • Social Science: 99/100 • English: 99/100 • Sanskrit: 99/100',
    quote: 'The conceptual clarity provided by our teachers and regular diagnostic mock tests on the digital platform eliminated all exam fear and helped me secure district rank 1.',
    badge: 'District Topper 🥇',
  },
  {
    id: 'top-2',
    name: 'Kabir Malhotra',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
    class: 'Class 12-Science (PCM + CS)',
    rollNo: 'Roll #1204',
    category: 'class12_science',
    title: 'CBSE Class 12 Science State Rank #2 (JEE Adv 99.85 %ile)',
    score: '99.2% Overall',
    subjectsBreakdown: 'Physics: 99/100 • Chemistry: 99/100 • Mathematics: 100/100 • Computer Science: 100/100',
    quote: 'Our robotics lab and computer science mentors gave me hands-on projects alongside board preparation. Scoring full marks in Math and CS was a dream come true.',
    badge: 'State Merit Award 🏆',
  },
  {
    id: 'top-3',
    name: 'Rhea Deshmukh',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    class: 'Class 12-Commerce (Maths)',
    rollNo: 'Roll #1221',
    category: 'class12_commerce',
    title: 'CBSE Class 12 Commerce School Topper (Double 100)',
    score: '98.8% Aggregate',
    subjectsBreakdown: 'Accountancy: 100/100 • Economics: 100/100 • Business Studies: 98/100 • Mathematics: 98/100',
    quote: 'Structured case-study workshops and real-world finance simulations made economics and balance sheets second nature for me. Proud to bring 100/100 in two papers!',
    badge: 'Commerce Centum 🌟',
  },
  {
    id: 'top-4',
    name: 'Devansh Pillai',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    class: 'Class 9-A',
    rollNo: 'Roll #908',
    category: 'olympiad',
    title: 'National Science Olympiad (NSO) All-India Rank #3',
    score: 'AIR #3 & Gold Medalist',
    subjectsBreakdown: 'Selected for International Junior Science Olympiad (IJSO) Training Camp',
    quote: 'My physics and chemistry mentors spent extra zero-periods answering my research questions on kinetic energy conservation. That support pushed me to national rank 3.',
    badge: 'National Olympiad 🎖️',
  },
  {
    id: 'top-5',
    name: 'Meera Nambiar',
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    class: 'Class 11-Humanities',
    rollNo: 'Roll #1105',
    category: 'arts',
    title: 'National Youth Parliament Best Speaker & Spell Bee Winner',
    score: 'National Gold Laureate',
    subjectsBreakdown: 'Best Delegate: National Model UN • 1st Prize: CBSE All-India Literary Fest',
    quote: 'The literary society and weekly parliamentary debates provided the stage where I honed my rhetoric and critical thinking for international youth conferences.',
    badge: 'National Orator 🎙️',
  },
  {
    id: 'top-6',
    name: 'Arjun Vats',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    class: 'Class 10-B',
    rollNo: 'Roll #1042',
    category: 'sports',
    title: 'UP State Under-17 Cricket Championship Player of the Tournament',
    score: '342 Runs & 18 Wickets',
    subjectsBreakdown: 'Captained Vidya Public School to State Championship Trophy',
    quote: 'Balancing board examinations and state championship cricket was made possible by flexible remedial scheduling and world-class turf grounds on campus.',
    badge: 'Cricket Champion 🏏',
  },
];

// ── Leadership Team Data ──
const leadershipTeam = [
  {
    name: 'Dr. K. P. Singhania',
    role: 'Chairman & Founder Trustee',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
    credentials: 'M.A., Ph.D. (Oxford), Former Advisor to Ministry of Education',
    message: 'True education harmonizes ancient Indian ethical heritage with cutting-edge scientific intellect, creating empathetic leaders ready to solve global challenges.',
  },
  {
    name: 'Dr. Sunita Sharma',
    role: 'Principal & Academic Director',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    credentials: 'Ph.D. Education (Delhi University), National Awardee Educator',
    message: 'We champion individualized intelligence. Every child possesses distinct genius; our digital tracking and compassionate mentors ensure no potential remains untapped.',
  },
  {
    name: 'Prof. R. V. Ramanathan',
    role: 'Vice Principal & Dean of Sciences',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    credentials: 'M.Sc. Physics (IIT Madras), 24 Years CBSE Chief Moderator',
    message: 'Rigorous conceptual inquiry combined with modern laboratory apparatus builds disciplined analytical minds capable of mastering competitive frontiers.',
  },
];

// ── Distinguished Faculty Data with Real Photos ──
const facultyData = [
  {
    name: 'Dr. Rajesh Iyer',
    subject: 'HOD Mathematics',
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    qualification: 'Ph.D. Applied Mathematics',
    experience: '18 Years Experience',
    specialty: 'Calculus, Vectors & Olympiad Coaching',
  },
  {
    name: 'Mrs. Anita Deshmukh',
    subject: 'HOD Physics',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    qualification: 'M.Sc. Physics, B.Ed.',
    experience: '14 Years Experience',
    specialty: 'Electromagnetism, Optics & Research Labs',
  },
  {
    name: 'Dr. Meenakshi Sundaram',
    subject: 'HOD Chemistry & Biotech',
    photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=600&q=80',
    qualification: 'Ph.D. Organic Chemistry',
    experience: '16 Years Experience',
    specialty: 'Organic Syntheses & NEET Foundations',
  },
  {
    name: 'Mr. Vikram Joshi',
    subject: 'HOD Computer Science & AI',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    qualification: 'M.Tech Computer Science',
    experience: '11 Years Experience',
    specialty: 'Python, Robotics & Machine Learning',
  },
  {
    name: 'Ms. Shalini Saxena',
    subject: 'HOD English & Literary Arts',
    photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80',
    qualification: 'M.A. English Literature',
    experience: '12 Years Experience',
    specialty: 'Debate, Model UN & Creative Writing',
  },
  {
    name: 'Coach Balwinder Singh',
    subject: 'Director of Physical Education',
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    qualification: 'M.P.Ed., NIS Certified',
    experience: '15 Years Experience',
    specialty: 'Athletics, Turf Cricket & Swimming',
  },
  {
    name: 'Dr. Priya Banerjee',
    subject: 'HOD Biology & Life Sciences',
    photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80',
    qualification: 'Ph.D. Genetics & Botany',
    experience: '13 Years Experience',
    specialty: 'Genetics, Ecology & Bio-Exhibits',
  },
  {
    name: 'Mr. Amit Trivedi',
    subject: 'HOD Social Sciences & History',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    qualification: 'M.A. History, M.Phil',
    experience: '14 Years Experience',
    specialty: 'World History, Civics & Mock Parliament',
  },
];

// ── Campus Facilities with High-Res Images ──
const campusFacilities = [
  {
    name: 'Smart Interactive Classrooms',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    desc: 'Equipped with 86-inch 4K touchscreen interactive panels, acoustic dampening, and digital lecture recording.',
    tag: 'Digital Learning',
  },
  {
    name: 'Advanced Physics & Chemistry Labs',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    desc: 'Spacious laboratory apparatus exceeding CBSE benchmarks with automated fume hoods and safety gear.',
    tag: 'STEM Inquiry',
  },
  {
    name: 'Robotics, IoT & AI Maker Lab',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    desc: '3D printers, Arduino & Raspberry Pi kits, drone assembly zones, and high-performance computing rigs.',
    tag: 'Innovation Hub',
  },
  {
    name: 'Modern Automated Library',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    desc: 'Over 18,000 volumes, international academic journals, Kindle e-readers, and quiet research carrels.',
    tag: 'Resource Center',
  },
  {
    name: 'Olympic Aquatic & Sports Complex',
    image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=800&q=80',
    desc: 'Half-Olympic heated swimming pool, floodlit turf cricket field, basketball courts, and indoor badminton.',
    tag: 'Athletic Excellence',
  },
  {
    name: 'Performing Arts & Auditorium',
    image: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?auto=format&fit=crop&w=800&q=80',
    desc: '1,000-seater air-conditioned acoustic hall for theatrical productions, symposia, and musical concerts.',
    tag: 'Cultural Stage',
  },
];

export function PublicSchoolWebsite() {
  const navigate = useNavigate();
  const { schoolConfig, websiteContent, schoolConfigs } = useSchoolData();
  const { currentSchoolId } = useAppStore();
  const { schoolPath, schoolSlug } = useSchoolSlug();

  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedNoticeModal, setSelectedNoticeModal] = useState<WebsiteNotice | null>(null);
  const [topperCategory, setTopperCategory] = useState<string>('all');

  // Admission inquiry form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryGrade, setInquiryGrade] = useState('Grade 6');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Active website content
  const activeContent: WebsiteContent = (websiteContent as WebsiteContent[]).find((w) => w.schoolId === currentSchoolId) || websiteContent[0];

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryEmail('');
    }, 5000);
  };

  const scrollTo = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredToppers = topperCategory === 'all'
    ? boardToppersData
    : boardToppersData.filter((t) => t.category === topperCategory);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* ── TOP UTILITY STRIP — TENANT-SCOPED ── */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Campus Helpline: {schoolConfig.phone || '+91 120 4567890'}</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{schoolConfig.email || 'admissions@vidyapublic.edu.in'}</span>
            </span>
            <span className="hidden lg:inline text-neutral-500">|</span>
            <span className="hidden lg:inline text-neutral-400 font-mono">CBSE Affiliation #2130894 • School Code #89410</span>
          </div>

          {/* Tenant URL Indicator + Portal Login */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-500 font-mono">/school/{schoolSlug}</span>
            <button
              onClick={() => navigate(schoolPath('/login'))}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer ml-2"
            >
              <span>Portal Login</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── PUBLIC STICKY NAVBAR ── */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          {/* Logo & School Name */}
          <div
            onClick={() => scrollTo('home')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-blue-500/25">
              {schoolConfig.logo || '🏫'}
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-foreground leading-tight">
                {schoolConfig.name}
              </h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                {schoolConfig.tagline || 'Excellence in Holistic Education & Leadership'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold">
            {[
              { id: 'home', label: 'Home' },
              { id: 'toppers', label: '🏆 Hall of Fame' },
              { id: 'about', label: 'About Us' },
              { id: 'academics', label: 'Academics' },
              { id: 'faculty', label: 'Faculty' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'achievements', label: 'Achievements' },
              { id: 'events', label: 'Events' },
              { id: 'notices', label: 'Notices' },
              { id: 'admissions', label: 'Admissions' },
              { id: 'contact', label: 'Contact' },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => scrollTo(nav.id)}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                  activeSection === nav.id
                    ? 'text-primary bg-primary/10 font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {nav.label}
              </button>
            ))}
          </nav>

          {/* Right Action: Portal Login */}
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => navigate(schoolPath('/login'))}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
            >
              <span>Portal Login</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-card border-b border-border p-4 space-y-1 animate-in fade-in">
            {[
              { id: 'home', label: 'Home' },
              { id: 'toppers', label: '🏆 Hall of Fame' },
              { id: 'about', label: 'About Us' },
              { id: 'academics', label: 'Academics' },
              { id: 'faculty', label: 'Faculty' },
              { id: 'facilities', label: 'Facilities' },
              { id: 'achievements', label: 'Achievements' },
              { id: 'events', label: 'Events' },
              { id: 'notices', label: 'Notices' },
              { id: 'admissions', label: 'Admissions' },
              { id: 'contact', label: 'Contact' },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => scrollTo(nav.id)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold hover:bg-muted"
              >
                {nav.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── 1. HERO BANNER WITH REAL CAMPUS IMAGE ── */}
      <section id="home" className="relative overflow-hidden py-20 md:py-28 bg-neutral-950 text-white">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80"
            alt="School Campus"
            className="w-full h-full object-cover object-center opacity-30 brightness-75 scale-105 transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Admissions Open for Academic Session 2026–2027</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                {activeContent.heroTitle || `Welcome to ${schoolConfig.name}`}
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl font-normal">
                {activeContent.heroSubtitle ||
                  'Nurturing scientific inquiry, ethical leadership, and athletic distinction across 25+ years of institutional heritage in Noida.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={() => scrollTo('admissions')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-600/30 text-sm px-6"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollTo('toppers')}
                  className="border-white/20 text-white hover:bg-white/10 text-sm font-semibold backdrop-blur-xs"
                >
                  <Trophy className="w-4 h-4 mr-2 text-amber-400" />
                  <span>View 2025-26 Board Toppers</span>
                </Button>
              </div>

              {/* Institutional Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-400">1,250+</div>
                  <div className="text-xs text-neutral-400 font-semibold">Enrolled Scholars</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">68</div>
                  <div className="text-xs text-neutral-400 font-semibold">Master Faculty</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">25+</div>
                  <div className="text-xs text-neutral-400 font-semibold">Years Excellence</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-400">99.4%</div>
                  <div className="text-xs text-neutral-400 font-semibold">District Top Score</div>
                </div>
              </div>
            </div>

            {/* Right: Featured Topper Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-neutral-900/90 backdrop-blur-xl text-white p-6 md:p-8 space-y-5">
                <div className="flex items-center justify-between">
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-xs px-2.5 py-1 font-bold">
                    ⭐ CBSE Board Topper 2025-26
                  </Badge>
                  <span className="text-xs text-neutral-400 font-mono">Rank #1 District</span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={boardToppersData[0].photo}
                    alt={boardToppersData[0].name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{boardToppersData[0].name}</h3>
                    <p className="text-xs text-amber-400 font-semibold">{boardToppersData[0].title}</p>
                    <div className="text-2xl font-black text-white mt-0.5">{boardToppersData[0].score}</div>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 italic leading-relaxed border-t border-white/10 pt-3">
                  &ldquo;{boardToppersData[0].quote}&rdquo;
                </p>

                <div className="text-[11px] text-neutral-400 bg-white/5 p-3 rounded-xl border border-white/10 space-y-1 font-mono">
                  <div className="font-bold text-emerald-400">Centum Scores:</div>
                  <div>Maths: 100/100 • Science: 100/100</div>
                </div>

                <Button
                  size="sm"
                  onClick={() => scrollTo('toppers')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs"
                >
                  <span>Explore Full Hall of Fame (6 Toppers)</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ⭐ HALL OF FAME: 2025-26 TOPPERS & ACADEMIC ACHIEVERS ── */}
      <section id="toppers" className="py-20 bg-gradient-to-b from-card via-muted/30 to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>Academic Distinction & Board Results 2025–2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              Our Star Achievers & Board Toppers
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Celebrating our exceptional students who demonstrated mastery across CBSE Board Examinations, National Olympiads, and State Championships this year.
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {[
                { id: 'all', label: 'All Achievers' },
                { id: 'class10', label: 'CBSE Class 10' },
                { id: 'class12_science', label: 'Class 12 Science' },
                { id: 'class12_commerce', label: 'Class 12 Commerce' },
                { id: 'olympiad', label: 'National Olympiads' },
                { id: 'sports', label: 'Sports Champions' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setTopperCategory(pill.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    topperCategory === pill.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Topper Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredToppers.map((topper) => (
              <Card
                key={topper.id}
                className="overflow-hidden border border-border/80 hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 group bg-card"
              >
                {/* Photo & Badge Banner */}
                <div className="relative h-64 overflow-hidden bg-neutral-900">
                  <img
                    src={topper.photo}
                    alt={topper.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                  {/* Badges Over Image */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-amber-500 text-neutral-950 font-black text-[11px] shadow-md">
                      {topper.badge}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-neutral-900/80 text-white text-[10px] font-mono border border-white/20 backdrop-blur-xs">
                      {topper.rollNo}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-xl font-black text-white">{topper.name}</h3>
                    <p className="text-xs text-amber-300 font-semibold">{topper.class}</p>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{topper.title}</span>
                      <span className="text-lg font-black text-foreground">{topper.score}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-mono bg-muted/40 p-2.5 rounded-xl border border-border/60">
                      {topper.subjectsBreakdown}
                    </p>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-border/60">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                      <Quote className="w-3.5 h-3.5 text-amber-500" />
                      <span>Student Reflection:</span>
                    </div>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      &ldquo;{topper.quote}&rdquo;
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. LEADERSHIP DESK: CHAIRMAN & PRINCIPAL ── */}
      <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider">
            Visionary Institutional Stewardship
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">
            Leadership & Governance Desk
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {activeContent.aboutText}
          </p>
        </div>

        {/* 3 Leadership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leadershipTeam.map((leader, idx) => (
            <Card key={idx} className="overflow-hidden border hover:shadow-lg transition-all bg-card">
              <div className="h-64 overflow-hidden relative">
                <img
                  src={leader.photo}
                  alt={leader.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-lg font-bold">{leader.name}</h3>
                  <p className="text-xs text-blue-300 font-semibold">{leader.role}</p>
                </div>
              </div>
              <CardContent className="p-5 space-y-3 text-xs">
                <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                  {leader.credentials}
                </Badge>
                <p className="text-muted-foreground leading-relaxed italic">
                  &ldquo;{leader.message}&rdquo;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 4. ACADEMICS & PEDAGOGY ── */}
      <section id="academics" className="py-16 bg-muted/30 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="text-xs font-semibold uppercase">Academic Excellence</Badge>
            <h2 className="text-3xl font-black text-foreground">Curriculum & Pedagogy</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Comprehensive CBSE learning pathways blending foundational literacy with experiential STEM problem solving.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xl">
                  🌱
                </div>
                <h3 className="text-base font-bold text-foreground">Primary Wing (Grades 1–5)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Focus on foundational numeracy, phonetics, environmental discovery, and creative clay & visual arts.
                </p>
                <div className="text-[11px] text-blue-600 font-semibold pt-2">
                  Phonics • Play-way Maths • Nature Walks
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-xl">
                  🚀
                </div>
                <h3 className="text-base font-bold text-foreground">Middle School (Grades 6–8)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Deep concept mastery in Algebra, Experimental Sciences, Python Coding, and Third Language acquisition.
                </p>
                <div className="text-[11px] text-indigo-600 font-semibold pt-2">
                  Robotics • Python Basics • Science Labs
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xl">
                  🏛️
                </div>
                <h3 className="text-base font-bold text-foreground">Senior Secondary (Grades 9–12)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Rigorous CBSE board syllabus prep across Science (PCM/PCB), Commerce, and Humanities with integrated entrance mentoring.
                </p>
                <div className="text-[11px] text-purple-600 font-semibold pt-2">
                  JEE/NEET Guidance • Board Test Series
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── 5. DISTINGUISHED TEACHING FACULTY WITH REAL PHOTOS ── */}
      <section id="faculty" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="outline" className="text-xs font-semibold uppercase">Our Mentors</Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground">Distinguished Teaching Faculty</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Passionate educators with an average of 14+ years of classroom mastery and postgraduate credentials from premier universities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facultyData.map((t, idx) => (
            <Card key={idx} className="overflow-hidden text-center hover:shadow-lg transition-all group bg-card">
              <div className="h-56 overflow-hidden relative">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-white text-left px-2">
                  <h4 className="text-sm font-bold truncate">{t.name}</h4>
                  <p className="text-xs text-amber-300 font-semibold">{t.subject}</p>
                </div>
              </div>
              <CardContent className="p-4 space-y-2 text-xs">
                <Badge variant="outline" className="text-[10px] font-mono">
                  {t.qualification}
                </Badge>
                <p className="text-[11px] text-muted-foreground">{t.experience}</p>
                <p className="text-[10px] text-blue-600 font-semibold pt-1 border-t border-border/60">
                  Specialty: {t.specialty}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── 6. CAMPUS FACILITIES WITH REAL ARCHITECTURAL PHOTOS ── */}
      <section id="facilities" className="py-20 bg-muted/20 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="text-xs font-semibold uppercase">World-Class Infrastructure</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">Campus Infrastructure & Facilities</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Purpose-built spaces engineered to stimulate scientific inquiry, digital innovation, and physical athleticism.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusFacilities.map((fac, idx) => (
              <Card key={idx} className="overflow-hidden hover:shadow-xl transition-all group bg-card">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-blue-600 text-white text-[10px] font-bold shadow-md">
                      {fac.tag}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="text-base font-bold text-white">{fac.name}</h4>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground leading-relaxed">{fac.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. ACHIEVEMENTS & AWARDS ── */}
      <section id="achievements" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="outline" className="text-xs font-semibold uppercase">Honors & Accolades</Badge>
          <h2 className="text-3xl font-black text-foreground">School Achievements</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Celebrating academic toppers, athletic champions, and national Olympiad winners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeContent.achievements.map((ach) => (
            <div key={ach.id} className="bg-card border border-amber-500/30 rounded-2xl p-6 space-y-3 shadow-xs hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono text-amber-600 border-amber-300">
                {ach.year} • {ach.category}
              </Badge>
              <h4 className="text-sm font-bold text-foreground">{ach.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{ach.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. EVENTS CALENDAR ── */}
      <section id="events" className="py-16 bg-muted/20 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="text-xs font-semibold uppercase">Campus Happenings</Badge>
            <h2 className="text-3xl font-black text-foreground">Upcoming & Past Events</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Explore cultural celebrations, science symposiums, and sports tournaments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(activeContent.events as WebsiteEvent[]).map((ev: WebsiteEvent) => (
              <Card key={ev.id} className="border hover:shadow-md transition-shadow bg-card">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      {ev.date}
                    </span>
                    <Badge variant={ev.type === 'upcoming' ? 'success' : 'outline'} className="text-[10px] capitalize">
                      {ev.type}
                    </Badge>
                  </div>
                  <h4 className="text-base font-bold text-foreground">{ev.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ev.description}</p>
                  <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ev.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {ev.venue}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. OFFICIAL NOTICE BOARD ── */}
      <section id="notices" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="text-xs font-semibold uppercase">Official Circulars</Badge>
            <h2 className="text-3xl font-black text-foreground mt-1">Institutional Notice Board</h2>
          </div>
          <span className="text-xs text-muted-foreground">Updated daily by Administration Office</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl divide-y divide-border/60 shadow-sm overflow-hidden">
          {(activeContent.notices as WebsiteNotice[]).map((n: WebsiteNotice) => (
            <div
              key={n.id}
              onClick={() => setSelectedNoticeModal(n)}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/40 transition-colors cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600">{n.date}</span>
                  <span className="text-muted-foreground">•</span>
                  <Badge variant="outline" className="text-[10px]">
                    Verified Circular
                  </Badge>
                </div>
                <h4 className="text-base font-bold text-foreground">{n.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">{n.content}</p>
              </div>

              <Button size="sm" variant="outline" className="text-xs shrink-0 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Read Notice</span>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ── 10. ADMISSIONS 2026-27 ── */}
      <section id="admissions" className="py-20 bg-muted/20 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="outline" className="text-xs font-semibold uppercase">Join Our Legacy</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">Admissions Session 2026–2027</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {activeContent.admissionInfo}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Step-by-Step Roadmap */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Step-by-Step Admission Roadmap</span>
              </h3>

              <div className="space-y-3">
                {(activeContent.admissionProcess as string[]).map((step: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/80 shadow-xs">
                    <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-xs font-medium text-foreground leading-relaxed mt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Interactive Online Admission Inquiry Form */}
            <div className="lg:col-span-5 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-lg space-y-5">
              <div>
                <h3 className="text-lg font-bold text-foreground">Online Admission Inquiry</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Submit details for admission kit & campus counseling session
                </p>
              </div>

              {inquirySubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-200 text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
                  <h4 className="text-sm font-bold">Inquiry Submitted Successfully!</h4>
                  <p className="text-xs">
                    Our Admissions Counselor will contact you within 24 business hours at {inquiryPhone}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold block mb-1">Student Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Aarav Sharma"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold block mb-1">Parent Mobile</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="font-semibold block mb-1">Applying Grade</label>
                      <select
                        value={inquiryGrade}
                        onChange={(e) => setInquiryGrade(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none"
                      >
                        <option value="Nursery">Nursery / KG</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 11">Grade 11</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Parent Email</label>
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 shadow-md shadow-blue-600/20 mt-2"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    <span>Submit Admission Application</span>
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 11. CONTACT & LOCATION ── */}
      <section id="contact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="outline" className="text-xs font-semibold uppercase">Get in Touch</Badge>
          <h2 className="text-3xl font-black text-foreground">Campus Contact & Location</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            We welcome prospective parents for guided campus walk-throughs Monday to Saturday.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Campus Address</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{activeContent.contactAddress}</p>
          </Card>

          <Card className="p-6 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Phone className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Direct Telephones</h4>
            <p className="text-xs text-muted-foreground">{activeContent.contactPhone}</p>
            <p className="text-[11px] text-muted-foreground">Mon–Sat: 8:00 AM to 4:00 PM</p>
          </Card>

          <Card className="p-6 text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">Electronic Mail</h4>
            <p className="text-xs text-muted-foreground">{activeContent.contactEmail}</p>
            <p className="text-[11px] text-muted-foreground">Inquiries: info@vidyapublic.edu.in</p>
          </Card>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-neutral-950 text-neutral-400 text-xs py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                {schoolConfig.logo || '🏫'}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{schoolConfig.name}</h3>
                <p className="text-[11px] text-neutral-500">
                  Affiliated to the Central Board of Secondary Education (CBSE), New Delhi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                onClick={() => navigate(schoolPath('/login'))}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Access School Management Portal
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
            <p>© 2026 {schoolConfig.name}. All institutional rights reserved.</p>
            <p>Powered by EduPulse Digital Intelligence & Management Platform</p>
          </div>
        </div>
      </footer>

      {/* ── NOTICE DETAIL MODAL ── */}
      {selectedNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">Official Circular</span>
                <h3 className="text-base font-bold text-foreground">{selectedNoticeModal.title}</h3>
              </div>
              <button
                onClick={() => setSelectedNoticeModal(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-foreground leading-relaxed">
              <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date: {selectedNoticeModal.date}</span>
                <span>•</span>
                <span>Target: All Parents, Guardians & Students</span>
              </div>
              <p>{selectedNoticeModal.content}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/70">
              <Button size="sm" variant="outline" onClick={() => setSelectedNoticeModal(null)} className="text-xs">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
