import React, { useState, useRef, useEffect } from 'react';
import { Film, Sparkles, Play, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoCard } from './VideoCard';
import { PROJECTS_DATA } from '../data/projects';
import { getStoredThumbnail, subscribeThumbnails } from '../utils/browserThumbnails';
import { unlockAudio } from '../utils/audioUnlock';

export const SelectedWork: React.FC = () => {
  // Extract Project #1: Featured 16:9 Cinema Film
  const featuredProject =
    PROJECTS_DATA.find((p) => p.aspectRatio === '16:9') || PROJECTS_DATA[0];

  const [featuredLoaded, setFeaturedLoaded] = useState(false);
  const [featuredCover, setFeaturedCover] = useState<string | null>(() => getStoredThumbnail(featuredProject.id));

  useEffect(() => {
    const unsub = subscribeThumbnails((id) => {
      if (!id || id === featuredProject.id) {
        const cover = getStoredThumbnail(featuredProject.id);
        if (cover) {
          setFeaturedCover(cover);
          setFeaturedLoaded(true);
        }
      }
    });
    return unsub;
  }, [featuredProject.id]);

  // Extract Projects #2 - #51: 50 Vertical 9:16 Reels
  const reels = PROJECTS_DATA.filter((p) => p.id !== featuredProject.id);

  // Carousel ref and scroll state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync scroll buttons and progress indicator
  const updateScrollState = () => {
    const el = carouselRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 15);
    setCanScrollRight(el.scrollLeft < maxScroll - 15);

    if (maxScroll > 0) {
      const progress = Math.min(100, Math.max(0, (el.scrollLeft / maxScroll) * 100));
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);

  // Smooth scroll handler for Desktop & Button navigation
  const handleScroll = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;

    // Scroll by ~1.6 card widths smoothly
    const firstCard = el.querySelector<HTMLElement>('[data-carousel-card]');
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 280;
    const scrollAmount = cardWidth * 1.6;

    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="selected-work" className="py-14 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* PART 1: 50 VERTICAL COMMERCIAL REELS (9:16)               */}
        {/* Section Header & Carousel Navigation Controls             */}
        {/* ========================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/[0.04] border border-orange-500/20 text-xs font-mono text-orange-300 mb-3">
              <Sparkles size={13} className="text-orange-400" />
              <span>50 VERTICAL COMMERCIAL REELS (9:16)</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Selected Works.
            </h2>
            <p className="mt-2 text-zinc-400 text-sm sm:text-base max-w-xl">
              High-converting vertical reels, kinetic commercial edits, and modern short-form brand storytelling directed by Oussama Brahami.
            </p>
            {/* Subtle Mobile Swipe Hint */}
            <div className="flex sm:hidden items-center gap-1.5 text-[11px] font-mono text-zinc-400 mt-2.5">
              <span>Swipe horizontally to explore all 50 reels</span>
              <span className="text-orange-400">→</span>
            </div>
          </div>

          {/* Right Controls: Count Pill & Desktop Navigation Arrows */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-300 bg-orange-500/[0.04] border border-orange-500/20 px-3.5 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <span className="text-orange-200/90 font-medium">50 Reels</span>
            </div>

            {/* Minimalist Left & Right Scroll Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="w-10 h-10 rounded-full bg-[#121215] hover:bg-orange-500/10 border border-white/[0.1] hover:border-orange-500/40 text-white hover:text-orange-400 flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                aria-label="Scroll carousel left"
                title="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="w-10 h-10 rounded-full bg-[#121215] hover:bg-orange-500/10 border border-white/[0.1] hover:border-orange-500/40 text-white hover:text-orange-400 flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                aria-label="Scroll carousel right"
                title="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* HORIZONTAL REELS CAROUSEL TRACK                           */}
        {/* Single Row • CSS Snap • Touch-Pan-X • Zero Scrollbars     */}
        {/* Peeking on Mobile (~215px) • Desktop (~280px-295px)       */}
        {/* ========================================================= */}
        <div
          ref={carouselRef}
          className="flex items-center gap-3.5 sm:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory touch-pan-x py-3 px-4 sm:px-6 lg:px-8 -mx-4 sm:-mx-6 lg:-mx-8 scroll-smooth carousel-gpu-track"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            willChange: 'transform',
            transform: 'translateZ(0)'
          }}
        >
          {reels.map((project, idx) => (
            <VideoCard
              key={project.id}
              project={project}
              index={idx}
            />
          ))}

          {/* Right end breathing space padding */}
          <div className="shrink-0 w-2 sm:w-4" aria-hidden="true" />
        </div>

        {/* ========================================================= */}
        {/* CAROUSEL PROGRESS TRACK INDICATOR                         */}
        {/* ========================================================= */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="w-40 sm:w-64 bg-white/[0.08] h-1 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_rgba(249,115,22,0.5)]"
              style={{ width: `${Math.max(8, scrollProgress)}%` }}
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* PART 2: CINEMATIC SHOWCASE & REELS (16:9 Widescreen Film) */}
        {/* Faculty of Architecture & Design • 2025                   */}
        {/* Badges strictly limited to "16:9" & "2:45"                */}
        {/* ========================================================= */}
        <div className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-zinc-300 mb-3">
                <Film size={13} className="text-white" />
                <span>CINEMATIC SHOWCASE & REELS</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Cinematic Showcase.
              </h3>
              <p className="mt-2 text-zinc-400 text-sm sm:text-base max-w-xl">
                Expansive 16:9 visual narratives and widescreen cinematography directed by Oussama Brahami.
              </p>
            </div>
          </div>

          <div className="-mx-4 sm:mx-0">
            <div className="flex items-center justify-between mb-3 px-4 sm:px-0">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
                <Award size={14} className="text-orange-400 shrink-0" />
                <span className="text-orange-400 font-semibold">{featuredProject.client}</span>
                <span>•</span>
                <span>{featuredProject.year}</span>
              </div>
            </div>

            <Link
              to={`/watch/${featuredProject.id}`}
              onClick={unlockAudio}
              className="group relative block rounded-none sm:rounded-3xl overflow-hidden bg-[#0e0e11] border-y sm:border border-white/[0.12] hover:border-orange-500/40 hover:shadow-[0_0_35px_rgba(249,115,22,0.18)] transition-all duration-300 cursor-pointer shadow-lg select-none active:scale-[0.99]"
            >
              {/* 16:9 Media Aspect Window - Strict aspect-video */}
              <div className="relative w-full aspect-video bg-[#0d0d10] overflow-hidden">
                {/* High-Contrast Cinematic Fallback (Zero Video Decoder) */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#20150e] via-[#140f0c] to-[#080808] flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center justify-center text-center p-6">
                    <div className="relative mb-3 flex items-center justify-center">
                      <div className="absolute w-20 h-20 rounded-full bg-orange-500/15 blur-xl pointer-events-none" />
                      <div className="w-16 h-16 rounded-full bg-black/40 border border-orange-500/40 flex items-center justify-center shadow-2xl">
                        <Film size={26} className="text-orange-400" />
                      </div>
                    </div>
                    <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-semibold mb-1">
                      {featuredProject.client}
                    </span>
                    <span className="text-sm sm:text-lg font-bold text-white max-w-md drop-shadow-md">
                      {featuredProject.title}
                    </span>
                  </div>
                </div>

                {/* Static Thumbnail (Pure <img> Tag - loading="lazy" decoding="async") */}
                <img
                  src={featuredCover || featuredProject.thumbnail}
                  alt={featuredProject.title}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => setFeaturedLoaded(true)}
                  className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 pointer-events-none ${
                    featuredLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Cinema Vignette & Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/30 pointer-events-none" />

                {/* Top Badges: STRICTLY "16:9" and "2:45" ONLY */}
                <div className="absolute top-2.5 sm:top-5 left-2.5 sm:left-5 right-2.5 sm:right-5 flex items-center justify-between z-10 pointer-events-none">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-mono uppercase bg-[#141416]/90 border border-orange-500/40 text-orange-400 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                    16:9
                  </span>
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-mono bg-[#141416]/90 border border-orange-500/30 text-orange-300 shadow-sm">
                    {featuredProject.duration}
                  </span>
                </div>

                {/* Centered Play Button (Responsive scale) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white text-black group-hover:bg-gradient-to-tr group-hover:from-orange-500 group-hover:to-amber-400 group-hover:text-black flex items-center justify-center shadow-2xl transition-all duration-300 scale-95 group-hover:scale-110 group-hover:shadow-[0_0_35px_rgba(249,115,22,0.6)]">
                    <Play size={20} className="translate-x-0.5 fill-current sm:hidden" />
                    <Play size={26} className="translate-x-0.5 fill-current hidden sm:block" />
                  </div>
                </div>

                {/* Bottom Information Overlay (Proportionally scaled for mobile) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 md:p-8 z-10 bg-gradient-to-t from-black/95 via-black/75 to-transparent">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono text-zinc-400 mb-0.5 sm:mb-1.5">
                    <span className="text-orange-400 font-semibold truncate max-w-[200px] sm:max-w-none">
                      {featuredProject.client}
                    </span>
                    <span>•</span>
                    <span>{featuredProject.year}</span>
                  </div>

                  <h3 className="text-xs sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight group-hover:text-zinc-200 transition-colors line-clamp-1 sm:line-clamp-2 drop-shadow-sm">
                    {featuredProject.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-3xl line-clamp-2 hidden sm:block leading-relaxed">
                    {featuredProject.description}
                  </p>

                  <div className="mt-2 sm:mt-4 pt-1.5 sm:pt-3 border-t border-white/15 flex items-center justify-between sm:justify-end">
                    <span className="text-[10px] font-mono text-zinc-400 sm:hidden">Tap to watch film</span>
                    <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white text-black font-semibold text-[10px] sm:text-xs group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-black transition-all shadow-md group-hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                      <Play size={11} className="fill-current" />
                      <span>Watch Full Film</span>
                    </span>
                  </div>
                </div>

              </div>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
