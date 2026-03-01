"use client";

import { useState } from 'react';

export default function AIChatPage() {
    const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
        { role: 'assistant', content: 'Привет! Я ИИ-ассистент CyberWhale, работаю на базе DeepSeek. Чем могу помочь с задачами?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const newMessages = [...messages, { role: 'user' as const, content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:4000/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ messages: newMessages })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.details || errData.error || 'Server error');
            }

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (err: any) {
            setError(err.message || 'Ошибка связи с ИИ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl py-8">
            <h1 className="text-3xl font-bold mb-6 text-cyan-400">ИИ Наставник</h1>
            <p className="text-gray-400 mb-6 font-mono text-sm">(DeepSeek API Client v0.12 MVP)</p>

            <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 h-[500px] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                                <span className="font-semibold text-xs block mb-1 opacity-70">
                                    {m.role === 'user' ? 'Вы' : 'AI'}
                                </span>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="p-3 rounded-lg bg-gray-700 text-gray-400 animate-pulse">
                                DeepSeek печатает...
                            </div>
                        </div>
                    )}
                </div>

                {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

                <form onSubmit={sendMessage} className="flex gap-2 isolate">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Задайте вопрос по CTF или курсам..."
                        className="flex-1 bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-cyan-500"
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !input.trim()}
                        className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-6 py-3 rounded transition-colors font-medium">
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    );
}