import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are the dedicated Studio Concierge for 'Lens & Light', a premium photography studio based in NYC led by Alex Morgan.
Your role is to assist potential clients with warmth, sophistication, and brevity.

**Studio Information:**
- **Photographer:** Alex Morgan (12+ years exp, Sony A7R V gear).
- **Style:** Authentic, unscripted, natural light, "soul of the moment".
- **Location:** NYC (Creative District), but available for worldwide travel (travel fees apply).

**Services & Pricing:**
- **Wedding & Engagement:** Starts at $2,400. Includes cinematic storytelling, 20-50+ retouched images.
- **Portraiture:** Starts at $350. Studio or outdoor options.
- **Commercial:** Custom quoting based on usage and scope.

**Booking Policy:**
- A 30% non-refundable retainer is required to secure a date.
- The remaining balance is due 2 weeks before the event.

**Guidelines:**
- If asked about specific date availability, politely encourage them to fill out the contact form to check the calendar.
- Keep responses concise (under 3 sentences) unless asked for details.
- Maintain a helpful, high-end professional tone.`;

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const StudioAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hello! I'm the Studio Assistant. How can I help you visualize your session today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize Gemini Chat
    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const newChat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
            }
        });
        setChat(newChat);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim() || !chat) return;

        const userText = inputValue;
        setInputValue('');
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setIsLoading(true);

        try {
            const response: GenerateContentResponse = await chat.sendMessage({ message: userText });
            const aiText = response.text || "I apologize, I'm having trouble connecting to the studio right now.";
            setMessages(prev => [...prev, { role: 'model', text: aiText }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, something went wrong. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-surface-dark text-white rotate-90' : 'bg-primary text-white'}`}
            >
                <span className="material-symbols-outlined text-2xl">
                    {isOpen ? 'close' : 'chat_bubble'}
                </span>
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-24 right-6 z-40 w-[90vw] md:w-96 max-h-[600px] h-[70vh] flex flex-col bg-white dark:bg-[#1a2232] rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-white/5 bg-surface-light dark:bg-[#1e283a] rounded-t-2xl">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-xl">smart_toy</span>
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#1e283a] rounded-full"></span>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Studio Concierge</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Online • Replies instantly</p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#111722]">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                    ? 'bg-primary text-white rounded-br-none' 
                                    : 'bg-white dark:bg-[#243047] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/5 rounded-bl-none shadow-sm'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-white dark:bg-[#243047] rounded-2xl rounded-bl-none px-4 py-3 border border-slate-200 dark:border-white/5 shadow-sm">
                                <div className="flex gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-[#1a2232] border-t border-slate-100 dark:border-white/5 rounded-b-2xl">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about pricing, style..."
                            className="w-full bg-slate-100 dark:bg-[#111722] text-slate-900 dark:text-white placeholder-slate-500 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isLoading}
                            className="absolute right-2 p-1.5 text-primary hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="material-symbols-outlined">send</span>
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-slate-400">AI-powered assistant. Info may vary.</p>
                    </div>
                </div>
            </div>
        </>
    );
};
