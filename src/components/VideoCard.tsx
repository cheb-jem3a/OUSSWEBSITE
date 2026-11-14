import React, { useState, useEffect } from 'react';
import { Play, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Project } from '../types';
import { getStoredThumbnail, subscribeThumbnails } from '../utils/browserThumbnails';
import { unlockAudio } from '../utils/audioUnlock';
import { prefetchVideo } from '../utils/videoPrefetch';

interface VideoCardProps {
  project: Project;
  className?: string;
  index?: number;
}

// High-contrast cinematic gradients for instant 60fps aesthetic placeholders
const CINEMATIC_GRADIENTS = [
  'from-[#240e11] via-[#160c0d] to-[#080808]', // Deep Crimson
  'from-[#1e0d10] via-[#140b0d] to-[#09090b]', // Dark Ruby
  'from-[#16171d] via-[#101014] to-[#080808]', // Deep Obsidian Slate
  'from-[#210d11] via-[#140b0d] to-[#080808]', // Wine Red
  'from-[#16121a] via-[#0f0d14] to-[#080808]', // Velvet Midnight
  'from-[#1c0e12] via-[#120a0d] to-[#09090b]', // Crimson Glow
];

export const VideoCard: React.FC<VideoCardProps> = ({
  project,
  className = '',
  index = 0
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [storedCover, setStoredCover] = useState<string | null>(() => getStoredThumbnail(project.id));

  // Listen to live browser-canvas generated thumbnail updates
  useEffect(() => {
    const unsubscribe = subscribeThumbnails((updatedId) => {
      if (!updatedId || updatedId === project.id) {
        const cover = getStoredThumbnail(project.id);
        if (cover) {
          setStoredCover(cover);
          setIsLoaded(true);
          setHasError(false);
        }
      }
    });
    return unsubscribe;
  }, [project.id]);

  const effectiveImageSrc = storedCover || project.thumbnail;
  const gradientClass = CINEMATIC_GRADIENTS[index % CINEMATIC_GRADIENTS.length];

  return (
    <Link
      to={`/watch/${project.id}`}
      onClick={unlockAudio}
      onMouseEnter={() => prefetchVideo(project.videoUrl)}
      onTouchStart={() => prefetchVideo(project.videoUrl)}
      data-carousel-card
      className={`group relative shrink-0 snap-start aspect-[9/16] w-[215px] sm:w-[250px] md:w-[280px] lg:w-[295px] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0d0d10] border border-white/[0.08] hover:border-red-500/40 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)] transition-all duration-300 flex flex-col justify-between cursor-pointer select-none active:scale-[0.98] carousel-card-contain ${className}`}
    >
      {/* ========================================================= */}
      {/* HIGH-CONTRAST CINEMATIC GRADIENT PLACEHOLDER              */}
      {/* 100% Zero-Decoder Instant 60 FPS Visual Foundation        */}
      {/* ========================================================= */}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradientClass} flex flex-col justify-between p-4 sm:p-5 pointer-events-none`}>
        {/* Film perforations decoration (35mm aesthetic) */}
        <div className="absolute left-1.5 top-12 bottom-12 flex flex-col justify-between opacity-15 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1 h-2 rounded-[1px] bg-white" />
          ))}
        </div>
        <div className="absolute right-1.5 top-12 bottom-12 flex flex-col justify-between opacity-15 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-1 h-2 rounded-[1px] bg-white" />
          ))}
        </div>

        {/* Center Glowing Reel Icon & Poster Graphics */}
        <div className="my-auto flex flex-col items-center justify-center text-center px-2">
          <div className="relative mb-3 flex items-center justify-center">
            <div className="absolute w-14 h-14 rounded-full bg-red-500/15 blur-lg pointer-events-none" />
            <div className="w-12 h-12 rounded-full bg-black/40 border border-red-500/30 group-hover:border-red-500/60 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Film size={20} className="text-red-400" />
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-semibold mb-1 truncate max-w-full">
            {project.client}
          </span>
          <span className="text-xs sm:text-sm font-bold text-white line-clamp-2 px-1 leading-snug drop-shadow-md">
            {project.title}
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* STATIC THUMBNAIL IMAGE (Pure <img> - Zero <video> Decoders)*/}
      {/* ========================================================= */}
      {!hasError && (
        <img
          src={effectiveImageSrc}
          alt={project.title}
          loading={index < 4 ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 pointer-events-none ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Atmospheric Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/60 pointer-events-none" />

      {/* Top Badges */}
      <div className="relative z-10 p-3 sm:p-3.5 flex items-center justify-between pointer-events-none">
        <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono uppercase bg-[#141416]/90 border border-white/15 group-hover:border-red-500/30 text-zinc-200 group-hover:text-red-200 transition-colors">
          9:16 Reel
        </span>
        <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono bg-[#141416]/90 border border-red-500/30 text-red-300 group-hover:border-red-500/60 group-hover:text-red-200 transition-colors">
          {project.duration}
        </span>
      </div>

      {/* Center Hover Play Button */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-black group-hover:bg-red-600 group-hover:text-white flex items-center justify-center shadow-lg group-hover:shadow-[0_0_25px_rgba(239,68,68,0.6)] transition-all duration-300 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100">
          <Play size={18} className="translate-x-0.5 fill-current" />
        </div>
      </div>

      {/* Bottom Content Information Overlay */}
      <div className="relative z-10 p-3.5 sm:p-4 flex flex-col justify-end pointer-events-none">
        <span className="text-[10px] sm:text-[11px] font-mono text-red-400 uppercase tracking-wider truncate mb-1">
          {project.client}
        </span>
        <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight line-clamp-2 group-hover:text-zinc-100 transition-colors leading-snug">
          {project.title}
        </h4>

        <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400 font-mono">
          <span>{project.year}</span>
          <span className="flex items-center gap-1 text-zinc-300 group-hover:text-red-400 transition-colors">
            <Play size={10} className="fill-current" />
            <span>Watch Reel</span>
          </span>
        </div>
      </div>
    </Link>
  );
};
