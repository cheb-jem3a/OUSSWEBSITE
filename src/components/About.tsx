import React, { useState } from 'react';
import { Camera } from 'lucide-react';

export const About: React.FC = () => {
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');

  return (
    <section id="about" className="py-24 sm:py-32 relative border-t border-white/[0.08] bg-[#070709] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column: Natural Aspect Ratio Portrait (5 cols) */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative w-full max-w-md rounded-2xl overflow-hidden border border-white/10 group-hover:border-orange-500/30 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.12)] bg-[#121215] shadow-2xl shadow-black/80 group transition-all duration-500">
              {/* Creator Photo preserving natural dimensions and aspect ratio */}
              <img
                src="/about.jpg"
                alt="Oussama Brahami"
                className="w-full h-auto object-cover rounded-2xl block transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Statement with Language Toggle [FR] / [EN] (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Header Row: DIRECTOR STATEMENT badge + Language Toggle Pill */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-400">
                <Camera size={12} className="text-zinc-300" />
                <span>DIRECTOR STATEMENT</span>
              </div>

              {/* Sleek Minimal Toggle Pill ([FR] / [EN]) with Warm Orange Active Pill */}
              <div className="inline-flex items-center p-1 rounded-full bg-[#121215] border border-white/[0.1] hover:border-orange-500/30 transition-colors shadow-inner">
                <button
                  type="button"
                  onClick={() => setLang('FR')}
                  className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                    lang === 'FR'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  aria-label="Afficher en Français"
                >
                  FR
                </button>
                <button
                  type="button"
                  onClick={() => setLang('EN')}
                  className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                    lang === 'EN'
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-[0_0_15px_rgba(249,115,22,0.4)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
              </div>
            </div>

            {/* Statement Copy */}
            <div className="relative">
              <p className="text-lg sm:text-2xl text-zinc-200 font-light leading-relaxed sm:leading-relaxed tracking-tight">
                {lang === 'FR' ? (
                  <>
                    Bonjour, je suis <span className="text-white font-medium">Oussama</span>, réalisateur, monteur et directeur créatif. J'aide les marques et les créateurs à se développer sur les réseaux sociaux grâce à des contenus percutants et une cinématographie soignée, adaptée à votre vision et votre budget. Plus de 100 clients, un seul objectif : <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent font-medium">vous faire sortir du lot</span>.
                  </>
                ) : (
                  <>
                    Hi, I'm <span className="text-white font-medium">Oussama</span>, a filmmaker, editor, and creative director. I help brands and creators grow on social media with high-impact visuals and refined visual storytelling tailored to your vision and budget. 100+ clients, one goal: <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent font-medium">make you stand out</span>.
                  </>
                )}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
