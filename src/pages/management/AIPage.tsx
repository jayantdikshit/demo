import React, { useState, useEffect, useRef } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { useSchoolData } from '@/hooks/useSchoolData';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  Users,
  TrendingUp,
  IndianRupee,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Clock,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

type AIMode = 'management' | 'teacher' | 'parent';

interface AIMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  mode?: AIMode;
  cardData?: {
    type: 'risk_students' | 'class_risk' | 'algebra_remedial' | 'attendance_summary' | 'delayed_syllabus' | 'parent_explanation';
    title: string;
    items?: any[];
    recommendations?: string[];
  };
}

export function AIPage() {
  const { schoolConfig, students, attendanceRecords, marksRecords, teachingPlans, feeTransactions, teachers } = useSchoolData();

  const [mode, setMode] = useState<AIMode>('management');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Welcome to the EduPulse Academic Intelligence Assistant for ${schoolConfig.name}. I synthesize real-time student attendance, examination results, teaching milestones, and fee registries to deliver actionable recommendations.`,
      time: '10:00 AM',
      mode: 'management',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Pre-built suggestions from Task 7.1
  const promptSuggestions = [
    {
      label: '🚨 Immediate Attention',
      prompt: 'Which students need immediate attention?',
      mode: 'management' as AIMode,
    },
    {
      label: '📉 Class 8 At-Risk',
      prompt: 'Show me students at risk in Class 8',
      mode: 'management' as AIMode,
    },
    {
      label: '📐 Remedial Algebra',
      prompt: 'Which students need remedial support in Algebra?',
      mode: 'teacher' as AIMode,
    },
    {
      label: '📊 Today\'s Attendance',
      prompt: "Summarize today's attendance across all classes",
      mode: 'management' as AIMode,
    },
    {
      label: '⏳ Delayed Syllabus',
      prompt: 'Which teachers have delayed syllabus?',
      mode: 'management' as AIMode,
    },
    {
      label: '👨‍👩‍👦 Aarav Performance',
      prompt: "Explain Aarav's performance in simple language",
      mode: 'parent' as AIMode,
    },
  ];

  const generateAIResponse = (query: string, queryMode: AIMode) => {
    const q = query.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (q.includes('immediate attention') || q.includes('need immediate')) {
      return {
        text: `I have identified 3 students requiring urgent institutional intervention based on compound risk indicators:`,
        cardData: {
          type: 'risk_students' as const,
          title: 'Immediate Attention Required (Composite Risk Drivers)',
          items: [
            {
              name: 'Aarav Sharma',
              class: 'Class 6-A (Roll #101)',
              risk: 'Attendance 71.4% (Threshold 75%), Math UT-1: 35%, 2 Fee Notices Unanswered',
              action: 'Schedule Parent Counselor Meeting & Enroll in Remedial Math',
            },
            {
              name: 'Pooja Verma',
              class: 'Class 8-B (Roll #204)',
              risk: 'Science 38%, Absent 4 consecutive days without medical leave slip',
              action: 'Trigger Absence Welfare Check & Assign Peer Study Buddy',
            },
            {
              name: 'Rohan Gupta',
              class: 'Class 9-A (Roll #312)',
              risk: 'Term 1 Marks dropped -18% vs Diagnostic Baseline, 3 syllabus assignments pending',
              action: 'Issue Teacher Diagnostic Intervention & Homework Assistance',
            },
          ],
          recommendations: [
            'Dispatch instant WhatsApp notices to registered parents via Parent Communication Center.',
            'Assign Subject Mentors for daily zero-period doubt clearance.',
            'Review intervention milestones in the Teacher Dashboard in 14 days.',
          ],
        },
      };
    }

    if (q.includes('class 8') || q.includes('at risk in class 8')) {
      return {
        text: `Class 8 diagnostic scan complete: 4 out of 38 enrolled students are exhibiting academic vulnerability:`,
        cardData: {
          type: 'class_risk' as const,
          title: 'Class 8 Academic Risk Profile',
          items: [
            {
              name: 'Pooja Verma',
              class: 'Class 8-B',
              risk: 'Scored 15/40 in Science, attendance dropping on lab days',
              action: 'Remedial Science practicals',
            },
            {
              name: 'Sameer Khan',
              class: 'Class 8-A',
              risk: 'Mathematics score 18/50, missed 2 weekly homework sets',
              action: 'Algebra concept worksheet series',
            },
            {
              name: 'Kavita Rawat',
              class: 'Class 8-B',
              risk: 'English Grammar score 42% (borderline pass)',
              action: 'Language lab reading module',
            },
          ],
          recommendations: [
            'Conduct joint Class Teacher + Subject Teacher review on Friday.',
            'Class 8 average score is 68.4%; remedial sessions can lift class mean to 74%.',
          ],
        },
      };
    }

    if (q.includes('algebra') || q.includes('remedial support in algebra')) {
      return {
        text: `Curriculum diagnosis for Mathematics — Topic: 'Algebra & Linear Equations':`,
        cardData: {
          type: 'algebra_remedial' as const,
          title: 'Remedial Cohort: Algebra & Linear Equations',
          items: [
            {
              name: 'Aarav Sharma',
              class: 'Class 6-A',
              risk: 'Concept Error: Transposition of negative coefficients (Accuracy: 28%)',
              action: 'Visual manipulative algebra tiles workshop',
            },
            {
              name: 'Neha Chawla',
              class: 'Class 6-A',
              risk: 'Word problem algebraic formulation difficulty',
              action: 'Step-by-step problem breakdown worksheet',
            },
            {
              name: 'Aditya Singh',
              class: 'Class 6-B',
              risk: 'Missed introduction lectures due to medical leave',
              action: 'Recorded video lecture replay + 15 min 1-on-1 review',
            },
          ],
          recommendations: [
            'Schedule 30-minute remedial session on Tuesday & Thursday at 3:30 PM.',
            'Generate formative micro-quizzes after 3 practice sets.',
          ],
        },
      };
    }

    if (q.includes('attendance') || q.includes("today's attendance")) {
      return {
        text: `Today's Campus Attendance Audit across all grade levels:`,
        cardData: {
          type: 'attendance_summary' as const,
          title: "Campus Attendance Summary (09-Sep-2026)",
          items: [
            { name: 'Grade 6', class: '2 Sections', risk: '92.8% Present (3 Absentees marked)', action: 'Automated SMS sent' },
            { name: 'Grade 7', class: '2 Sections', risk: '95.1% Present (2 Absentees marked)', action: 'Automated SMS sent' },
            { name: 'Grade 8', class: '2 Sections', risk: '86.4% Present (5 Absentees marked)', action: 'Flagged for Class Teacher' },
            { name: 'Grade 9', class: '2 Sections', risk: '94.2% Present (2 Absentees marked)', action: 'All on time' },
            { name: 'Grade 10', class: '2 Sections', risk: '97.5% Present (1 Absentee marked)', action: 'Board exam cohort stable' },
          ],
          recommendations: [
            `Total Campus Attendance: 93.2% (Comfortably above statutory ${schoolConfig.attendanceThreshold}% benchmark).`,
            'Grade 8 shows the highest absence rate today (5 absent) — Class Teacher notified.',
          ],
        },
      };
    }

    if (q.includes('delayed syllabus') || q.includes('teachers have delayed')) {
      return {
        text: `Teaching Plan & Delivery Calendar Audit:`,
        cardData: {
          type: 'delayed_syllabus' as const,
          title: 'Curriculum Delays & Overdue Topics',
          items: [
            {
              name: 'Dr. Rajesh Iyer',
              class: 'Class 6-A • Mathematics',
              risk: 'Chapter 4: Fractions & Decimals (5 days overdue)',
              action: 'Zero-period extra instruction scheduled',
            },
            {
              name: 'Vikram Joshi',
              class: 'Class 9-A • Social Science',
              risk: 'Chapter 3: Nazism & Rise of Hitler (3 days overdue)',
              action: 'Digital flipped-classroom module assigned',
            },
          ],
          recommendations: [
            'Both teachers have submitted recovery plans to cover backlogs before Mid-Term Exams.',
            'No curriculum delays reported in Science, English, or Hindi.',
          ],
        },
      };
    }

    if (q.includes('aarav') || q.includes('simple language') || q.includes('parent')) {
      return {
        text: `Parent-Friendly Progress Summary for Aarav Sharma (Class 6-A):`,
        cardData: {
          type: 'parent_explanation' as const,
          title: "Aarav's Learning Journey (Plain Language Parent Report)",
          items: [
            {
              name: 'Where Aarav is Shining 🌟',
              class: 'Science & English',
              risk: 'Aarav is very active in Science experiments and has great English reading skills (scored 88% and 82%). Teachers praise his curiosity.',
              action: 'Keep encouraging his science projects!',
            },
            {
              name: 'Where Aarav Needs a Little Help 💡',
              class: 'Mathematics (Fractions & Algebra)',
              risk: 'Aarav gets a bit confused when negative numbers move across the equals sign. He scored 35% in Unit Test 1.',
              action: 'The school has enrolled him in free zero-period doubt sessions on Tue & Thu.',
            },
            {
              name: 'Attendance Reminder 📅',
              class: 'Current: 71.4%',
              risk: 'Aarav missed 4 days last month due to viral fever. He needs 3 more weeks of regular attendance to get back above the 75% goal.',
              action: 'Daily attendance will comfortably bring him back to green zone.',
            },
          ],
          recommendations: [
            'Spend 15 minutes reviewing math flashcards at home every evening.',
            'Feel free to connect with his Class Teacher Dr. Rajesh Iyer on Saturday PTM.',
          ],
        },
      };
    }

    // Default intelligent response
    return {
      text: `I have analyzed campus records for ${schoolConfig.name} in response to your query "${query}":`,
      cardData: {
        type: 'risk_students' as const,
        title: 'Institutional Intelligence Insight',
        items: [
          {
            name: 'Campus Status',
            class: 'Affiliated CBSE',
            risk: 'Active enrollments conform to academic progression benchmarks',
            action: 'All systems operational',
          },
        ],
        recommendations: [
          'You can ask specific questions about at-risk students, attendance trends, syllabus delays, or fee collections.',
          'Try clicking one of the pre-built prompt buttons above for instant deep diagnostics.',
        ],
      },
    };
  };

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsTyping(true);

    // Simulate real AI processing latency & streaming
    setTimeout(() => {
      const responseData = generateAIResponse(textToSend, mode);
      const aiMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseData.text,
        cardData: responseData.cardData,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <PageWrapper
      title="AI Academic Intelligence Assistant"
      subtitle="Autonomous student risk detection, curriculum pacing analytics, and plain-language parent insights"
      statusBadge={
        <Badge variant="outline" className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 font-mono text-xs flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Demo AI Engine v2.4</span>
        </Badge>
      }
    >
      {/* ── Mode Selector Tabs (Task 7.1 Specification) ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border/80 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">AI Intelligence Persona:</h3>
              <Badge variant="outline" className="text-[10px] font-semibold uppercase">
                {mode} Persona
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Select persona to alter AI analysis perspective & terminology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/60 self-stretch sm:self-auto">
          {[
            { id: 'management', label: '🏛️ Management AI', desc: 'School-wide metrics' },
            { id: 'teacher', label: '👨‍🏫 Teacher AI', desc: 'Classroom & marks' },
            { id: 'parent', label: '👨‍👩‍👦 Parent AI', desc: 'Simple language' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as AIMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === tab.id
                  ? 'bg-card text-foreground shadow-xs font-bold border border-border/50'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Pre-built Prompt Chips (Task 7.1 Specification) ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Recommended Investor & Principal Demonstration Prompts (Click to test):</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {promptSuggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMode(item.mode);
                handleSend(item.prompt);
              }}
              className="text-xs py-1.5 px-3 rounded-xl border border-border/80 bg-card hover:bg-purple-500/10 hover:border-purple-500/40 text-foreground transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>{item.label}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* ── Chat Canvas ── */}
      <Card className="border border-border/80 shadow-md">
        <CardHeader className="py-3 px-5 border-b border-border/70 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-foreground">Interactive Session Active</span>
            <span className="text-[11px] text-muted-foreground">• Model: EduPulse-Academic-7B</span>
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setMessages([
                {
                  id: `reset-${Date.now()}`,
                  sender: 'ai',
                  text: `Conversation memory reset for ${schoolConfig.name}. Ask me any question or select a prompt suggestion above.`,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="text-xs h-7 text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset Chat
          </Button>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-4 max-h-[520px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs space-y-3 shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-muted/50 border border-border/80 text-foreground rounded-tl-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-70">
                  <span className="font-semibold">
                    {msg.sender === 'user' ? 'You' : 'EduPulse Academic AI'}
                  </span>
                  <span>{msg.time}</span>
                </div>

                <p className="leading-relaxed font-normal text-sm">{msg.text}</p>

                {/* Structured Diagnostic Cards Attached by AI */}
                {msg.cardData && (
                  <div className="bg-card border border-border/80 rounded-xl p-4 space-y-3 mt-2 shadow-xs">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                        <span>{msg.cardData.title}</span>
                      </h4>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        Verified Insight
                      </Badge>
                    </div>

                    {/* Items List */}
                    {msg.cardData.items && (
                      <div className="space-y-2">
                        {msg.cardData.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg border border-border/60 bg-muted/30 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground">{it.name}</span>
                              <span className="text-[10px] text-muted-foreground font-mono">{it.class}</span>
                            </div>
                            <p className="text-muted-foreground text-[11px] leading-relaxed">
                              {it.risk}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5">
                              <CheckCircle2 className="w-3 h-3 shrink-0" />
                              <span>Action: {it.action}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* AI Recommendations */}
                    {msg.cardData.recommendations && (
                      <div className="pt-2 border-t border-border/60 space-y-1 text-[11px]">
                        <span className="font-bold text-foreground block">
                          Recommended Action Protocol:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                          {msg.cardData.recommendations.map((rec, rIdx) => (
                            <li key={rIdx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                  You
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-muted/50 border border-border/80 rounded-2xl px-4 py-3 text-xs flex items-center gap-1.5 text-muted-foreground">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce delay-200" />
                <span className="text-[11px] ml-1">Analyzing campus database...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Bar */}
        <div className="p-4 border-t border-border/70 bg-card rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={`Ask ${mode} AI any question (e.g., "Which students need attention?", "Summarize attendance", etc.)...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-border/70 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <Button
              type="submit"
              size="default"
              disabled={!input.trim() || isTyping}
              className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 text-xs px-4"
            >
              <Send className="w-4 h-4 mr-1.5" />
              <span>Query AI</span>
            </Button>
          </form>
        </div>
      </Card>
    </PageWrapper>
  );
}
