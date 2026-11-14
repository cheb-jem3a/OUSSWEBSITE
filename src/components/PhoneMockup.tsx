import React, { useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { unlockAudio } from '../utils/audioUnlock';

interface PhoneMockupProps {
  videoUrl?: string;
  poster?: string;
  title?: string;
  targetId?: string;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  videoUrl = 'https://smmmtfqfxjhserliagbz.supabase.co/storage/v1/object/public/videos/reel-24.mp4',
  poster = '/thumbnails/eps-land.webp',
  title = 'Commercial Showreel',
  targetId = 'reel-24-eps-land'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play the hero preview smoothly with audio muted (guarantees 100% browser autoplay allowance)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct DOM property enforcement (crucial for Chrome/Edge/Safari unmuted policy bypass)
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startPlayback = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback: retry once user moves mouse or touches screen
          const onFirstTouch = () => {
            video.muted = true;
            video.play().catch(() => {});
            window.removeEventListener('touchstart', onFirstTouch);
            window.removeEventListener('click', onFirstTouch);
          };
          window.addEventListener('touchstart', onFirstTouch, { once: true, passive: true });
          window.addEventListener('click', onFirstTouch, { once: true, passive: true });
        });
      }
    };

    startPlayback();

    video.addEventListener('loadeddata', startPlayback);
    video.addEventListener('canplay', startPlayback);

    // Resume when browser tab regains focus
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        startPlayback();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      video.removeEventListener('loadeddata', startPlayback);
      video.removeEventListener('canplay', startPlayback);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [videoUrl]);

  return (
    <div className="relative mx-auto w-[250px] sm:w-[280px] md:w-[300px] select-none">
      {/* Outer Glow Halo behind Phone Frame */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-600/25 via-red-900/10 to-transparent rounded-[50px] blur-2xl transform scale-95 -z-10 pointer-events-none" />

      {/* Realistic Smartphone Chassis */}
      <div className="relative rounded-[46px] p-3 bg-gradient-to-b from-[#2a2a2e] via-[#161619] to-[#0c0c0e] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.12)] border border-white/[0.08]">
        
        {/* Inner Bezel Screen */}
        <div className="relative rounded-[36px] overflow-hidden bg-black aspect-[9/19.5] border border-black shadow-inner">
          
          {/* Dynamic Island Notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30 flex items-center justify-between px-2.5 border border-white/[0.08] pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/10 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-900/60" />
            </div>
            <div className="w-2 h-2 rounded-full bg-[#161619] border border-white/5" />
          </div>

          {/* Dynamic Video Showreel Stage */}
          <Link
            to={`/watch/${targetId}`}
            onClick={unlockAudio}
            className="relative w-full h-full overflow-hidden block cursor-pointer group"
          >
            {/* Smooth Looping Autoplay Showreel Video (100% Hardware Accelerated) */}
            <video
              ref={(node) => {
                videoRef.current = node;
                if (node) {
                  node.muted = true;
                  node.defaultMuted = true;
                }
              }}
              src={encodeURI(videoUrl)}
              poster={poster}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-label={title}
              onCanPlay={(e) => {
                e.currentTarget.muted = true;
                e.currentTarget.play().catch(() => {});
              }}
              onError={(e) => {
                const currentTarget = e.currentTarget;
                const currentSrc = currentTarget.currentSrc || currentTarget.src;
                if (currentSrc.includes('.us.archive.org/')) {
                  currentTarget.src = currentSrc.replace(/https:\/\/[^/]+\/\d+\/items\//, 'https://archive.org/download/');
                  currentTarget.load();
                  currentTarget.play().catch(() => {});
                }
              }}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Subtle cinematic gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30 pointer-events-none" />

            {/* Subtle glass glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-transparent pointer-events-none" />

            {/* Center Hover Prompt: Clean 'Watch Full Film' */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black group-hover:bg-red-600 group-hover:text-white flex items-center justify-center shadow-2xl transition-all duration-300 scale-90 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                <Play size={22} className="translate-x-0.5 fill-current" />
              </div>
              <span className="mt-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white uppercase tracking-wider shadow-lg">
                Watch Full Film
              </span>
            </div>

            {/* Bottom Status Tag */}
            <div className="absolute bottom-3.5 left-3 right-3 z-20 flex items-center justify-between text-[10px] font-mono text-zinc-300 pointer-events-none">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>Showreel Preview</span>
              </span>
              <span className="text-[10px] text-zinc-400 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
                <span>Watch Film</span>
                <span>↗</span>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PhoneMockup;
