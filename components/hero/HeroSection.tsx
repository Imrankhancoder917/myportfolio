"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Download, Sun, ArrowRight, Mail, Menu, X, Terminal, Send, Bot } from 'lucide-react';

type ChatMessage = {
  role: 'model' | 'user';
  text: string;
};

const App = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // AI Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Imran's AI clone ✨. Ask me anything about his skills, experience, or what it's like to work with him!" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  // Gemini API call with exponential backoff
  const fetchGeminiResponse = async (userMessage: string): Promise<string> => {
    const apiKey = ""; // API key is injected by the environment
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const systemInstruction = "You are the AI assistant for Imran Khan, a Full Stack Engineer and AI Enthusiast. You speak professionally but friendly. Keep your answers concise (under 3 sentences). Highlight his skills in React, Next.js, Node, TypeScript, and AI integrations when relevant. If asked something unrelated to tech or hiring Imran, politely steer the conversation back to his professional profile.";

    const payload = {
      contents: [{ parts: [{ text: userMessage }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };

    const maxRetries = 5;
    const delays = [1000, 2000, 4000, 8000, 16000];

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error("API Error");
        
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
      } catch {
        if (i === maxRetries - 1) return "Network error connecting to AI. Please try again later.";
        await new Promise(res => setTimeout(res, delays[i]));
      }
    }

    return "Sorry, I couldn't process that.";
  };

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!userInput.trim() || isTyping) return;

    const newUserMsg: ChatMessage = { role: 'user', text: userInput };
    setChatMessages(prev => [...prev, newUserMsg]);
    setUserInput('');
    setIsTyping(true);

    const aiReply = await fetchGeminiResponse(newUserMsg.text);
    
    setChatMessages(prev => [...prev, { role: 'model', text: aiReply }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Injecting Premium Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>

      <div className="min-h-screen bg-[#fcfcfc] text-gray-900 font-sans selection:bg-gray-900 selection:text-white overflow-hidden relative">
        {/* Ambient Background Glows - Ultra Subtle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gray-200/30 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-40 pointer-events-none"></div>

        {/* Navigation */}
        <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-[1400px] mx-auto lg:px-12">
          <div className="flex items-center gap-1 cursor-pointer group">
            <span className="text-2xl font-serif font-bold tracking-tight text-gray-900 group-hover:opacity-80 transition-opacity">IK</span>
            <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mb-3"></div>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-12 text-[13px] tracking-wide font-medium text-gray-500">
            <li className="text-gray-900 cursor-pointer hover:text-gray-900 transition-colors">About</li>
            <li className="cursor-pointer hover:text-gray-900 transition-colors">Projects</li>
            <li className="cursor-pointer hover:text-gray-900 transition-colors">Skills</li>
            <li className="cursor-pointer hover:text-gray-900 transition-colors">Experience</li>
            <li className="cursor-pointer hover:text-gray-900 transition-colors">Contact</li>
          </ul>

          <div className="hidden md:flex items-center gap-5">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white/50 backdrop-blur-md border border-gray-200/80 rounded-full text-[13px] font-medium hover:border-gray-300 hover:bg-white transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              Download Resume <Download size={14} className="text-gray-500" />
            </button>
            <button className="p-2.5 bg-white/50 backdrop-blur-md border border-gray-200/80 rounded-full hover:border-gray-300 hover:bg-white transition-all duration-300 text-gray-600 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <Sun size={16} />
            </button>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-24 left-4 right-4 bg-white/95 backdrop-blur-xl z-50 border border-gray-100 rounded-3xl shadow-2xl p-6">
            <ul className="flex flex-col gap-5 text-base font-medium text-gray-600">
              <li className="text-gray-900">About</li>
              <li>Projects</li>
              <li>Skills</li>
              <li>Experience</li>
              <li>Contact</li>
            </ul>
            <div className="mt-8 flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-gray-900 text-white rounded-2xl text-sm font-medium">
                Download Resume <Download size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <main className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-12 lg:pt-20 pb-32 flex flex-col gap-20 lg:gap-32">
          
          {/* Hero Split Section - Enforcing strictly Side-by-Side on Desktop */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16 w-full max-w-7xl mx-auto">
            
            {/* Left Typography Section */}
            <div className="flex-1 flex flex-col items-start text-left z-10 w-full md:pr-8">
              
              <div className="flex flex-wrap items-center gap-3 mb-8 text-[11px] font-bold tracking-[0.25em] text-gray-500 uppercase">
                <span>Full Stack Engineer</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>AI Enthusiast</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span>Problem Solver</span>
              </div>

              <h1 className="text-[2.75rem] leading-[1.1] sm:text-6xl lg:text-7xl font-serif text-gray-900 tracking-tight mb-8">
                Crafting Scalable <br className="hidden sm:block" />
                Digital Experiences <br className="hidden sm:block" />
                with Code & <br className="hidden md:block" /><span className="italic text-gray-500 font-light pr-4">Intelligence.</span>
              </h1>

              <p className="text-lg text-gray-500 font-light leading-relaxed mb-10 max-w-lg">
                I build fast, scalable and beautiful web applications with modern technologies and AI-powered solutions that solve real world problems.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 w-full">
                <button className="flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-[13px] font-medium hover:bg-gray-800 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] group w-full sm:w-auto">
                  View Projects 
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-900 border border-indigo-100 rounded-2xl text-[13px] font-medium hover:border-indigo-200 hover:shadow-sm transition-all w-full sm:w-auto relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/0 via-white/50 to-purple-100/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  ✨ Interview AI Clone
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-gray-800 border border-gray-200/80 rounded-2xl text-[13px] font-medium hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm transition-all w-full sm:w-auto">
                  <Mail size={16} className="text-gray-500" />
                </button>
              </div>
            </div>

            {/* Right Portrait Image Section */}
            <div className="relative w-full md:w-[45%] flex justify-center md:justify-end shrink-0">
              {/* Outer container for hover effects */}
              <div className="group relative w-full max-w-[420px] md:ml-auto aspect-[4/5] cursor-pointer">
                {/* Animated Glow Backdrop */}
                <div className="absolute inset-0 bg-gray-200/60 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 scale-105 mix-blend-multiply"></div>
                
                {/* Image Wrapper */}
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-gray-100 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] group-hover:-translate-y-3 group-hover:rotate-1 transition-all duration-700 bg-white p-3">
                  <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-gray-100">
                    <Image
                      src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                      alt="Developer Portrait" 
                      fill
                      sizes="(min-width: 768px) 420px, 100vw"
                      className="w-full h-full object-cover object-[center_20%] transform transition-transform duration-1000 group-hover:scale-110"
                    />
                    {/* Inner Shadow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Subtle Availability Badge inside Image */}
                  <div className="absolute bottom-6 right-6 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-white/50 transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-gray-700 uppercase">Available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards / Bento Box Section (Subtle Integration) */}
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
            
            {/* 1. Code Snippet Card - Takes up larger portion */}
            <div className="md:col-span-7 bg-[#111] rounded-3xl p-8 shadow-xl border border-gray-800 relative overflow-hidden group hover:border-gray-700 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800/20 rounded-full blur-[60px] pointer-events-none"></div>
              
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800/50">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-gray-400">
                  <Terminal size={18} />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium">developer_profile.ts</h4>
                  <p className="text-gray-500 text-[11px] font-medium mt-0.5">TypeScript</p>
                </div>
              </div>

              <div className="font-mono text-[13px] md:text-sm leading-loose text-gray-300">
                <p><span className="text-[#c678dd]">const</span> <span className="text-[#e5c07b]">developer</span> <span className="text-[#56b6c2]">=</span> {'{'}</p>
                <p className="pl-6"><span className="text-[#e06c75]">name:</span> <span className="text-[#98c379]">&quot;Imran Khan&quot;</span>,</p>
                <p className="pl-6"><span className="text-[#e06c75]">role:</span> <span className="text-[#98c379]">&quot;Full Stack Engineer&quot;</span>,</p>
                <p className="pl-6"><span className="text-[#e06c75]">passion:</span> <span className="text-[#d19a66]">[&quot;Web&quot;, &quot;AI&quot;, &quot;DSA&quot;]</span>,</p>
                <p className="pl-6"><span className="text-[#e06c75]">focus:</span> <span className="text-[#98c379]">&quot;Building scalable digital products&quot;</span>,</p>
                <p>{'}'};</p>
              </div>
            </div>

            {/* Right Column Stack for smaller cards */}
            <div className="md:col-span-5 flex flex-col gap-6">
              
              {/* 2. Streak & Problems (Side by Side on mobile, row on desktop) */}
              <div className="grid grid-cols-2 gap-6 h-full">
                {/* Streak Card */}
                <div className="bg-white/60 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col justify-between group">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase mb-2">Commit Streak</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-serif text-gray-900 group-hover:scale-105 origin-left transition-transform">24</span>
                      <span className="text-[10px] text-gray-400 font-medium">Days</span>
                    </div>
                  </div>
                  
                  {/* Subtle Bar Chart */}
                  <div className="flex items-end justify-between h-12 gap-1.5 mt-6">
                    {['M','T','W','T','F','S','S'].map((day, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 w-full">
                        <div 
                          className={`w-full rounded-t-sm ${i === 4 || i === 5 ? 'bg-gray-800' : 'bg-gray-200'}`} 
                          style={{ height: `${[30, 40, 50, 30, 70, 90, 50][i]}%` }}
                        ></div>
                        <span className="text-[8px] font-bold text-gray-400">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Problems Solved Card */}
                <div className="bg-white/60 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all flex flex-col justify-between group">
                  <div>
                    <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase mb-2">Problems Solved</p>
                    <div className="flex flex-col gap-1">
                      <span className="text-4xl font-serif text-gray-900 group-hover:scale-105 origin-left transition-transform">1,547</span>
                      <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full w-max mt-1">
                        +12.5% this month
                      </span>
                    </div>
                  </div>

                  {/* Subtle Sparkline */}
                  <svg className="w-full h-10 overflow-visible mt-6" viewBox="0 0 100 30">
                    <path 
                      d="M 0 20 Q 15 15, 25 25 T 50 15 T 75 22 T 100 5" 
                      fill="none" 
                      stroke="#111827" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="opacity-20"
                    />
                    <path 
                      d="M 0 20 Q 15 15, 25 25 T 50 15 T 75 22 T 100 5" 
                      fill="none" 
                      stroke="#111827" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      strokeDasharray="150"
                      strokeDashoffset="0"
                    />
                    <circle cx="100" cy="5" r="3" fill="#111827" />
                  </svg>
                </div>
              </div>
              
              {/* 3. Tech Stack Card */}
              <div className="bg-white/60 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-center h-full">
                <div className="flex items-center justify-between mb-4">
                   <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">Core Stack</p>
                   <span className="text-[10px] font-semibold text-gray-900 hover:underline cursor-pointer">View All</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* React Icon */}
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100/80 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#61DAFB]" fill="currentColor"><path d="M11.955 2.551c-4.108 0-7.838 1.488-9.845 3.966-.757.927-1.157 1.95-1.157 2.973 0 1.023.4 2.046 1.157 2.973 2.007 2.478 5.737 3.966 9.845 3.966 4.108 0 7.838-1.488 9.845-3.966.757-.927 1.157-1.95 1.157-2.973 0-1.023-.4-2.046-1.157-2.973-2.007-2.478-5.737-3.966-9.845-3.966zm0 1.706c3.216 0 6.035 1.096 7.649 2.871.492.54.776 1.127.776 1.7 0 .573-.284 1.16-.776 1.7-1.614 1.775-4.433 2.871-7.649 2.871-3.216 0-6.035-1.096-7.649-2.871-.492-.54-.776-1.127-.776-1.7 0-.573.284-1.16.776-1.7 1.614-1.775 4.433-2.871 7.649-2.871zm-5.717 3.268c1.378-2.186 3.738-3.664 6.44-4.004.283-.036.529-.282.529-.569 0-.287-.246-.533-.529-.569-3.272-.413-6.19 1.432-7.817 4.093-.153.251.002.571.288.618 1.258.204 2.399.715 3.328 1.482.203.167.496.069.584-.176.326-.902.774-1.737 1.332-2.483.176-.234-.144-.542-.396-.395-1.122.656-2.072 1.547-2.775 2.617-.156.241-.497.234-.645-.013-.231-.384-.48-.75-.747-1.101-.161-.212-.047-.533.225-.569 1.116-.149 2.22-.1 3.283.137.262.059.458-.198.344-.439-.425-.898-.957-1.716-1.579-2.436-.182-.212-.519-.104-.546.173-.075.766-.289 1.503-.624 2.181-.122.247-.463.267-.615.037-.308-.47-.648-.918-1.022-1.341-.186-.21-.525-.102-.55.176a9.907 9.907 0 0 0-.203 2.138c.005.281-.253.504-.53.489-.968-.052-1.921-.246-2.836-.576-.255-.091-.321-.429-.115-.6.828-.691 1.761-1.257 2.766-1.674.257-.107.283-.464.048-.611-.849-.533-1.782-.942-2.766-1.206-.271-.073-.413-.377-.282-.628.78-1.508 1.944-2.784 3.385-3.662.242-.148.55.003.585.286.064.524.053 1.054-.035 1.572-.043.256.223.447.458.33.916-.456 1.905-.748 2.934-.863z"/></svg>
                  </div>
                  {/* Next.js */}
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center border border-gray-800 hover:-translate-y-0.5 transition-transform cursor-pointer shadow-sm">
                    <span className="text-white font-bold text-lg leading-none">N</span>
                  </div>
                  {/* Node */}
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100/80 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#83CD29]" fill="currentColor"><path d="M12.012.013l-10.42 6.02v11.968l10.42 6.007 10.435-6.007V6.033L12.012.013zM6.924 16.32v-5.28l4.437 5.28h2.09V7.697h-1.96v5.266l-4.422-5.266h-2.106v8.623h1.96z"/></svg>
                  </div>
                  {/* TS Icon */}
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100/80 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                    <div className="w-6 h-6 bg-[#3178C6] text-white text-[10px] font-bold flex items-center justify-center rounded-sm">TS</div>
                  </div>
                  {/* Tailwind (Mocked via T) */}
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100/80 hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                    <span className="text-[#38B2AC] font-bold text-xl italic leading-none">~</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* AI Chat Modal Overlay */}
        {isChatOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[500px] border border-gray-100 transform transition-all scale-100 animate-in zoom-in-95 duration-300">
              
              {/* Chat Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">IK Assistant ✨</h3>
                    <p className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Online
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-white">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-gray-900 text-white rounded-br-sm' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-4 py-3.5 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Area */}
              <div className="p-4 bg-white border-t border-gray-100">
                <form 
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full p-1.5 pl-4 focus-within:border-gray-400 focus-within:bg-white transition-colors"
                >
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about my tech stack..."
                    className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder-gray-400 outline-none w-full"
                    disabled={isTyping}
                  />
                  <button 
                    type="submit"
                    disabled={!userInput.trim() || isTyping}
                    className="p-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={14} className="ml-0.5" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
