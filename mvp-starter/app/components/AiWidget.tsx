'use client';

import { useState, useRef, useEffect } from 'react';

export default function AiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    {
      role: 'assistant',
      content: 'Привет! Я ИИ-ассистент CyberWhale. Решаешь CTF или застрял на курсе? Спрашивай!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage.getItem('token'));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen, mounted]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const newMessages = [...messages, { role: 'user' as const, content: userMsg }];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.details || errData.error || 'Server error');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `[Ошибка]: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !hasToken) return null; // Не показываем виджет до монтирования и гостям

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-lg w-80 sm:w-96 h-[500px] mb-4 flex flex-col overflow-hidden text-slate-200">
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐳</span>
              <div>
                <h3 className="font-bold text-cyan-400">ИИ Наставник</h3>
                <p className="text-xs text-slate-400">На базе DeepSeek</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white pb-1"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg text-sm max-w-[85%] ${
                    m.role === 'user'
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : 'bg-slate-700 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg text-sm bg-slate-700 text-slate-400 animate-pulse rounded-bl-none">
                  кибер-кит думает...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-slate-800 border-t border-slate-700">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Спроси меня о задаче..."
                className="flex-1 bg-slate-900 text-sm border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
              {/* Send Button SVG */}
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2 rounded transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-4 rounded-full shadow-lg transition-transform transform hover:-translate-y-1 ${
          isOpen ? 'bg-slate-700 text-slate-300' : 'bg-cyan-600 text-white hover:bg-cyan-500'
        }`}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0-1.634.908-3.084 2.215-3.832V6a2.25 2.25 0 012.25-2.25h10.5A2.25 2.25 0 0119.5 6v2.928c1.307.748 2.215 2.198 2.215 3.832v3.75c0 1.634-.908 3.085-2.215 3.832v1.5a2.25 2.25 0 01-2.25 2.25H6.75a2.25 2.25 0 01-2.25-2.25v-1.5c-1.307-.747-2.215-2.198-2.215-3.832v-3.75z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15h7.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 11.25h7.5" />
          </svg>
        )}
      </button>
    </div>
  );
}
