import * as React from 'react';
import { Bot, Send, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export interface AIMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIAssistantWidget: React.FC<{ defaultOpen?: boolean }> = ({ defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [input, setInput] = React.useState('');
  const { students, currentSchoolId } = useAppStore();

  const [messages, setMessages] = React.useState<AIMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am EduPulse AI. Ask me anything like "Which students are at risk in Grade 10?" or "Summarize today\'s fee collection".',
      timestamp: 'Just now',
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: AIMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: input,
      timestamp: 'Just now',
    };

    let aiReply = "I've analyzed the platform records. 3 students have attendance below the required threshold, and fee collection is on track at 78%.";
    const lower = input.toLowerCase();
    if (lower.includes('risk') || lower.includes('attendance')) {
      const riskStudents = students.filter(s => s.schoolId === currentSchoolId).slice(0, 2);
      aiReply = `Found ${riskStudents.length} students requiring intervention: ${riskStudents.map(s => s.name).join(', ')}. Would you like me to draft SMS notifications for their parents?`;
    } else if (lower.includes('fee')) {
      aiReply = 'Total fee collection stands at ₹18,40,000 against ₹24,00,000 expected. 12 defaulters have dues exceeding 30 days.';
    }

    const aiMsg: AIMessage = {
      id: String(Date.now() + 1),
      sender: 'ai',
      text: aiReply,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <>
      {/* Floating Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <Bot size={20} className="animate-bounce" />
          <span className="text-xs font-bold tracking-wide uppercase">AI Assistant</span>
          <Sparkles size={14} className="text-amber-300" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[90vw] rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-xs">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold">EduPulse Intelligence AI</h4>
                <p className="text-[10px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Context: Current School
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={cn('flex flex-col', msg.sender === 'user' ? 'items-end' : 'items-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs',
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  )}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask intelligence assistant..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              onClick={handleSend}
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
