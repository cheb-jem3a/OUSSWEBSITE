import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Share2,
  Check,
  Disc3,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import type { Project } from '../types';

interface VideoLightboxProps {
  project: Project | null;
  onClose: () => void;
}

export const VideoLightbox: React.FC<VideoLightboxProps> = ({
  project,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [criticalError, setCriticalError] = useState<string | null>(null);
  const [prevUrl, setPrevUrl] = useState(project?.videoUrl);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Synchronize state during render when project changes
  if (project?.videoUrl !== prevUrl) {
    setPrevUrl(project?.videoUrl);
    setCriticalError(null);
  }

  const handleClose = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!project) return;
    console.log('Current Video URL:', project.videoUrl);

    const currentVideo = videoRef.current;

    // Pause all other video elements on the page (e.g. hero mockup)
    document.querySelectorAll('video').forEach((v) => {
      if (v !== currentVideo) {
        v.pause();
      }
    });

    // Programmatic auto-play with browser security policy fallback
    if (currentVideo) {
      const playPromise = currentVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: Error) => {
          console.warn('Unmuted autoplay blocked by browser policy; muting to launch immediately:', err.name);
          currentVideo.muted = true;
          currentVideo.play().catch(() => {});
        });
      }
    }

    return () => {
      if (currentVideo) {
        currentVideo.pause();
      }
    };
  }, [project]);

  // Keyboard shortcut listener (ESC to close)
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, handleClose]);

  // Lock body scroll
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    if (touchEndY - touchStartY > 100) {
      handleClose();
    }
    setTouchStartY(null);
  };

  if (!project) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in select-none"
      onClick={handleClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full sm:h-auto sm:max-h-[92vh] max-w-6xl bg-[#0c0c0e] sm:rounded-3xl border border-white/[0.12] shadow-2xl flex flex-col lg:flex-row overflow-hidden"
      >
        {/* Mobile Swipe Dismiss Indicator */}
        <div className="w-12 h-1 bg-white/30 rounded-full mx-auto my-2 block sm:hidden" />

        {/* Top Control Bar for Mobile */}
        <div className="flex items-center justify-between px-4 py-2 sm:hidden border-b border-white/[0.08]">
          <span className="text-xs font-mono text-zinc-400 truncate max-w-[200px]">
            {project.title}
          </span>
          <button
            onClick={handleClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-white active:bg-white/10 rounded-full cursor-pointer"
            aria-label="Close Modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* Video Player Section: Bulletproof Native Player */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px]">
          {criticalError ? (
            <div className="flex flex-col items-center justify-center text-center p-6 text-zinc-300">
              <AlertTriangle className="text-orange-500 mb-2" size={32} />
              <p className="text-sm font-mono mb-3">{criticalError}</p>
              <button
                onClick={() => {
                  setCriticalError(null);
                  videoRef.current?.load();
                }}
                className="px-4 py-2 rounded-full bg-orange-500 text-black font-semibold text-xs cursor-pointer shadow-lg active:scale-95"
              >
                Retry Playback
              </button>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <video
                key={project.id || project.videoUrl}
                ref={videoRef}
                src={encodeURI(project.videoUrl).replace(/#/g, '%23')}
                poster={project.thumbnail}
                controls
                controlsList="nodownload noplaybackrate noremoteplayback"
                disablePictureInPicture
                autoPlay
                playsInline
                preload="auto"
                className={`w-full max-h-[80vh] ${
                  project.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]'
                } object-contain rounded-xl shadow-2xl bg-black`}
                onLoadedMetadata={() => console.log('Stream ready:', project.videoUrl)}
                onError={(e) => {
                  const currentTarget = e.currentTarget;
                  const currentSrc = currentTarget.currentSrc || currentTarget.src;
                  if (currentSrc.includes('.us.archive.org/')) {
                    currentTarget.src = currentSrc.replace(/https:\/\/[^/]+\/\d+\/items\//, 'https://archive.org/download/');
                    currentTarget.load();
                    currentTarget.play().catch(() => {});
                    return;
                  }
                  const mediaErr = currentTarget.error;
                  console.error('Video Error Object:', mediaErr);
                  if (mediaErr && mediaErr.code === MediaError.MEDIA_ERR_DECODE) {
                    setCriticalError('Critical media decode error. Please try another video or browser.');
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Project Details Sidebar / Drawer */}
        <div className="w-full lg:w-[380px] p-5 sm:p-6 flex flex-col justify-start bg-[#0e0e11] border-t lg:border-t-0 lg:border-l border-white/[0.08] overflow-y-auto max-h-[45vh] lg:max-h-full">
          {/* Desktop Top Close & Share */}
          <div className="hidden sm:flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
              <Disc3 size={13} className="text-orange-500 animate-spin" />
              <span>PROJECT REEL VIEWER</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Share link"
              >
                {copied ? <Check size={16} className="text-orange-400" /> : <Share2 size={16} />}
              </button>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Meta Tags - Year & Duration */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-zinc-900 border border-white/10 text-zinc-300">
              {project.year}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-orange-500/10 border border-orange-500/30 text-orange-300">
              {project.duration}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.06] text-zinc-400 uppercase">
              {project.aspectRatio}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {project.title}
          </h2>

          <span className="text-xs font-mono text-orange-400 uppercase tracking-wider mt-1 block">
            {project.client}
          </span>

          <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {project.description}
          </p>

          {/* Quick link to dedicated distraction-free page */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-500">
              Direct URL available
            </span>
            <Link
              to={`/watch/${project.id}`}
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/40 text-xs font-mono text-zinc-300 hover:text-orange-400 transition-all active:scale-95"
            >
              <span>Dedicated Page</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLightbox;
