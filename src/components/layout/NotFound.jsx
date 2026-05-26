import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Compass, MessageSquare, Shield, Layers, Plus } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0E0C] text-white flex flex-col font-sans select-none relative overflow-hidden">
      
      {/* Radial ambient glow in background (green/lime glow matching Kasi branding) */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#D4F263]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="h-20 w-full max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <img src="/kasi.png" alt="Kasi" className="h-6 w-auto object-contain select-none" />
          <span className="text-sm font-black tracking-tight text-white select-none">kasi</span>
        </div>
        
        <div className="flex items-center gap-6 text-xs font-semibold text-gray-400">
          <span className="hover:text-white cursor-pointer transition-colors hidden md:inline" onClick={() => navigate('/help')}>Help Center</span>
          <span className="hover:text-white cursor-pointer transition-colors hidden md:inline" onClick={() => navigate('/settings')}>Settings</span>
          <a 
            href="https://www.usekasi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#D4F263] hover:bg-[#c2e24d] text-black font-extrabold rounded-full transition-all border border-black shadow-[2px_2px_0px_#000000] text-[10px]"
          >
            JOIN WAITLIST
          </a>
        </div>
      </header>

      {/* Main 404 Concept Grid (Matches Solar Digital design layout) */}
      <main className="flex-1 flex items-center justify-center px-6 relative z-10 py-10">
        <div className="max-w-6xl w-full flex items-center justify-between gap-4 relative">
          
          {/* Big White block-style number "4" on the left */}
          <div className="hidden lg:flex flex-1 items-center justify-end relative select-none">
            {/* Top decorative neon arrow */}
            <div className="absolute top-4 right-10 text-[#D4F263] animate-bounce">
              <svg className="w-16 h-16 rotate-95" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            
            <span className="text-[280px] xl:text-[340px] font-black leading-none tracking-tighter text-white opacity-95 select-none pr-10 border-r border-gray-900 font-mono">
              4
            </span>
          </div>

          {/* Central Card representing the "0" - Rounded white box */}
          <div className="w-full max-w-md bg-white text-black p-8 md:p-10 rounded-[32px] shadow-[0px_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 flex flex-col justify-between space-y-8 animate-in zoom-in-95 duration-500 min-h-[480px]">
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-green-700 bg-green-50 px-3 py-1 rounded-full w-fit">
                ... 404 error ...
              </div>
              <h2 className="text-3xl font-black tracking-tight leading-tight text-gray-950">
                Sorry, page not found
              </h2>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Even our sharpest AI sales assistant couldn't locate this route. Navigate back to secure dashboard modules.
              </p>
            </div>

            {/* Clickable Card List with arrows (matches About us, Portfolio, Solution Hub in the concept image) */}
            <div className="space-y-3">
              {[
                { 
                  title: 'Sales Dashboard', 
                  desc: 'Back to your core sales command center', 
                  path: '/dashboard',
                  icon: Layers 
                },
                { 
                  title: 'Conversations & Chats', 
                  desc: 'Talk to customers and track sales deals', 
                  path: '/chats',
                  icon: MessageSquare 
                },
                { 
                  title: 'Logistics Fleet', 
                  desc: 'Coordinate deliveries and track multi-riders', 
                  path: '/logistics',
                  icon: Compass 
                }
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={idx}
                    onClick={() => navigate(item.path)}
                    className="group flex items-center justify-between p-4 bg-[#F5F6F8] hover:bg-[#ECFDF3] rounded-2xl cursor-pointer border border-transparent hover:border-green-200 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white group-hover:bg-green-100 p-2 rounded-xl text-gray-500 group-hover:text-green-700 transition-colors shadow-sm">
                        <IconComponent size={16} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-black text-gray-900 leading-none">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-1.5 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    
                    {/* Circle Arrow indicator */}
                    <div className="w-7 h-7 bg-white group-hover:bg-[#1A7A4A] group-hover:text-white text-gray-600 rounded-full flex items-center justify-center transition-all shadow-sm">
                      <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Small Brand label */}
            <div className="text-[9px] font-black uppercase text-gray-400 tracking-wider text-center border-t border-gray-100 pt-4 flex items-center justify-center gap-1.5">
              <Shield size={10} className="text-green-700" /> Secure Admin Infrastructure
            </div>
          </div>

          {/* Big White block-style number "4" on the right */}
          <div className="hidden lg:flex flex-1 items-center justify-start relative select-none">
            {/* Bottom decorative neon arrow */}
            <div className="absolute bottom-4 left-10 text-[#D4F263] animate-bounce">
              <svg className="w-16 h-16 rotate-[275deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            
            <span className="text-[280px] xl:text-[340px] font-black leading-none tracking-tighter text-white opacity-95 select-none pl-10 border-l border-gray-900 font-mono">
              4
            </span>
          </div>

        </div>
      </main>

      {/* Small footer */}
      <footer className="h-16 w-full text-center text-[10px] text-gray-500 font-semibold flex items-center justify-center z-20 shrink-0 border-t border-gray-900">
        © {new Date().getFullYear()} KASI SALES INFRASTRUCTURE • ALL RIGHTS RESERVED
      </footer>
    </div>
  );
};

export default NotFound;
