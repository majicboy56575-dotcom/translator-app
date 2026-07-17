import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setMounted(true), 100);

    const handleMouseMove = (e) => {
      const x = (window.innerWidth / 2 - e.pageX) / 40;
      const y = (window.innerHeight / 2 - e.pageY) / 40;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNext = () => {
    navigate('/camera');
  };

  return (
    <div className="bg-background text-on-surface font-body-md overflow-hidden min-h-screen" style={{ background: 'radial-gradient(circle at 50% -20%, #ffd9e2 0%, #f8f9ff 50%)' }}>
      {/* Header / Brand */}
      <header className="w-full flex items-center justify-center pt-12 pb-6 px-margin-mobile">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
          </div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">LingoLens</h1>
        </div>
      </header>
      
      {/* Main Content Canvas */}
      <main 
        className="flex-1 flex flex-col items-center justify-between min-h-[calc(100vh-140px)] px-margin-mobile" 
        style={{
          opacity: mounted ? 1 : 0, 
          transform: mounted ? 'translateY(0px)' : 'translateY(20px)', 
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Illustration Section */}
        <div className="flex-1 flex items-center justify-center w-full max-w-md">
          <div className="relative w-full aspect-square flex items-center justify-center">
            {/* Decorative Shapes */}
            <div className="absolute w-64 h-64 bg-secondary-container/40 rounded-full blur-3xl"></div>
            <div className="absolute w-48 h-48 bg-primary-fixed/30 rounded-full blur-2xl -top-4 -left-4"></div>
            
            {/* Translation Visual */}
            <div 
              className="relative z-10 animate-float flex items-center justify-center" 
              style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
            >
              <div className="bg-white/70 backdrop-blur-md p-lg rounded-[2.5rem] shadow-sm border border-white/50 flex flex-col items-center gap-md">
                <div className="flex items-center gap-sm">
                  <button className="px-md py-sm bg-surface-container-high rounded-full border border-outline-variant hover:opacity-80 active:scale-95 transition-all cursor-pointer">
                    <span className="font-label-md text-label-md text-on-surface-variant">English</span>
                  </button>
                  <button className="hover:opacity-80 active:scale-90 transition-all cursor-pointer flex items-center">
                    <span className="material-symbols-outlined text-primary">swap_horiz</span>
                  </button>
                  <button className="px-md py-sm bg-primary-container rounded-full shadow-sm hover:opacity-80 active:scale-95 transition-all cursor-pointer">
                    <span className="font-label-md text-label-md text-on-primary">Spanish</span>
                  </button>
                </div>
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-xl">
                  <img 
                    alt="Translation View" 
                    className="w-full h-full object-cover grayscale-[0.2]" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9Sxi8B8kfdQv1U3I6Nb-JEQz-ybZXzJiiAViFJSmlyGVlRyiG5y9fG4svkLfq8zc85411OE1-BuuQluRY84zl2ny6MYMWjDc47wYMA37CMVVjx8gS_1QMXLl1tjhMD-STTbZQLieb0OJgjsU9VPRFHFpaf1Zyq2prh71HzVYW1g02ooZgjIF5VgQ03BLwViWiGugjnTkjuavSsqJHy4N8N4149G8yocUd9GNhXZzvGaLwSvihPbUIQJBX-rnOpFze1nqzUONJwLY" 
                  />
                  <div className="absolute inset-0 bg-primary/10 border-2 border-primary/40 rounded-xl"></div>
                  <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-on-primary rounded text-[10px] font-bold uppercase tracking-widest">Live</div>
                </div>
                <div className="flex flex-col items-center text-center gap-xs w-full">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Detecting Text...</span>
                  <div className="h-1 w-24 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/2 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Section */}
        <div className="w-full max-w-sm flex flex-col items-center text-center pb-xl">
          <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-md">Unlock the World with LingoLens</h2>
          <p className="font-body-md text-body-md text-on-surface-variant px-md">
            Instantly translate text through your camera lens
          </p>
        </div>

        {/* Action Section */}
        <div className="w-full max-w-sm pb-12">
          <button 
            onClick={handleNext}
            className="w-full h-[56px] bg-primary text-on-primary font-label-md text-label-md rounded-full shadow-md active:bg-on-primary-fixed-variant transition-all duration-200 flex items-center justify-center gap-sm group active:scale-95"
          >
            Scan
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
          <div className="mt-lg flex justify-center gap-base">
            <div className="w-8 h-1.5 rounded-full bg-primary"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-surface-container-highest"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-surface-container-highest"></div>
          </div>
        </div>
      </main>
    </div>
  );
}
