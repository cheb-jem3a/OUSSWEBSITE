import React from 'react';
import { Play, Mail } from 'lucide-react';
import { PhoneMockup } from './PhoneMockup';

interface HeroProps {
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork }) => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-28 sm:pt-36 pb-16 sm:pb-24 overflow-hidden">
      {/* Background Cinematic Gradients & Mesh Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-orange-500/[0.05] via-zinc-500/[0.02] to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-orange-500/[0.04] rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-amber-500/[0.03] rounded-full blur-[140px] -z-10 pointer-events-none" />

      {/* Subtle Grid Accent */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Bio & Primary Actions (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            
            {/* Top Pill Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/[0.04] border border-orange-500/20 backdrop-blur-md mb-6 hover:border-orange-500/40 transition-all duration-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              </span>
              <span className="text-[11px] sm:text-xs font-medium tracking-wide text-orange-200/90">
                Filmmaking • Cinematography • High-Impact Reels
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-2xl sm:max-w-3xl">
              Visual Storytelling That{' '}
              <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
                Stops The Scroll.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-base sm:text-lg md:text-xl text-zinc-400 max-w-xl font-normal leading-relaxed">
              Replacing generic video production with cinematic, thumb-stopping 9:16 vertical reels and widescreen commercial narratives for forward-thinking brands.
            </p>

            {/* Action Buttons (Pure Showcase / Contact) */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <button
                onClick={onExploreWork}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all duration-300 shadow-[0_0_35px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
              >
                <Play size={15} className="text-black fill-current group-hover:scale-110 transition-transform" />
                <span>Watch Reel Showcase</span>
              </button>

              <a
                href="#contact"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] hover:border-white/30 text-white font-medium text-sm transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
              >
                <Mail size={15} className="text-zinc-300" />
                <span>Get in Touch</span>
              </a>
            </div>

            {/* Stats Micro Row on Desktop */}
            <div className="mt-10 pt-8 border-t border-white/[0.08] grid grid-cols-3 gap-6 sm:gap-8 w-full max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                  10M+
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                  Organic Views
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                  199+
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                  Projects Delivered
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                  100%
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">
                  Satisfied Clients
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Clean Interactive 9:16 Phone Frame Mockup (5 cols on lg) */}
          <div className="lg:col-span-5 flex justify-center relative mt-4 lg:mt-0">
            {/* Interactive Phone Mockup with smooth moving video preview */}
            <PhoneMockup
              videoUrl="https://smmmtfqfxjhserliagbz.supabase.co/storage/v1/object/public/videos/reel-24.mp4"
              poster="/thumbnails/eps-land.webp"
              title="Eps Land // Commercial Showreel"
              targetId="reel-24-eps-land"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
