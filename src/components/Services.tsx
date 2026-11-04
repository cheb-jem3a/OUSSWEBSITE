import React from 'react';
import {
  Smartphone,
  Film,
  Palette,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { CREATOR_PROFILE } from '../data/projects';

export const Services: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="text-white" size={20} />;
      case 'Film':
        return <Film className="text-white" size={20} />;
      case 'Palette':
      default:
        return <Palette className="text-white" size={20} />;
    }
  };

  return (
    <section id="services" className="py-24 sm:py-32 relative border-t border-white/[0.08] bg-[#09090b]">
      {/* Background Ambience */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-400 mb-4">
            <Sparkles size={13} className="text-zinc-300" />
            <span>CREATIVE DISCIPLINES & CRAFT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            High-Impact Filmmaking Crafted for Scale.
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed">
            From viral short-form social campaigns to prestigious widescreen brand films, every production is executed with cinematic rigor.
          </p>
        </div>

        {/* 3-Column Disciplines Showcase Grid (Pure Showcase, No Inquire/Booking buttons) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CREATOR_PROFILE.services.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-3xl p-6 sm:p-8 bg-[#101013] border border-white/[0.08] hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_15px_40px_rgba(249,115,22,0.08)]"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.1] group-hover:border-orange-500/40 group-hover:bg-orange-500/10 flex items-center justify-center group-hover:scale-105 transition-all">
                    {getIcon(service.icon)}
                  </div>
                  <span className="text-xs font-mono text-zinc-400 group-hover:text-orange-400 transition-colors">
                    DISCIPLINE // {service.stepNumber}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight group-hover:text-zinc-100 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-zinc-300 font-medium mt-1 mb-3">
                  {service.tagline}
                </p>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {service.description}
                </p>

                {/* Deliverables Bullet List (3 items per card) */}
                <div className="mt-6 pt-6 border-t border-white/[0.06] space-y-2.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                    Key Deliverables:
                  </span>
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <CheckCircle2 size={14} className="text-orange-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
