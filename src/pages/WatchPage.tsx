import React, { useRef, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Film,
  AlertTriangle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/projects';
import type { Project } from '../types';
import { prefetchVideo } from '../utils/videoPrefetch';

export const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Locate current project by id (or partial id match)
  const projectIndex = PROJECTS_DATA.findIndex(
    (p) => p.id === id || p.id.startsWith(id || '') || (id && id.startsWith(p.id))
  );

  const currentIndex = projectIndex !== -1 ? projectIndex : 0;
  const project: Project = PROJECTS_DATA[currentIndex];

  // Previous & Next navigation targets
  const prevProject = PROJECTS_DATA[(currentIndex - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length];
  const nextProject = PROJECTS_DATA[(currentIndex + 1) % PROJECTS_DATA.length];

  // Playback state
  const [criticalError, setCriticalError] = useState<string | null>(null);
  const [prevId, setPrevId] = useState(project.id);
  const [copied, setCopied] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  // Synchronize state during render when project changes
  if (project.id !== prevId) {
    setPrevId(project.id);
    setCriticalError(null);
    setIsBuffering(true);
  }

  // Pre-fetch next video stream in background for instantaneous next-reel transitions
  useEffect(() => {
    if (nextProject?.videoUrl) {
      prefetchVideo(nextProject.videoUrl);
    }
  }, [nextProject?.videoUrl]);

  // Scroll to top on project route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [project.id]);

  // Audio & Playback enforcer: strictly UNMUTED AUDIO by default
  const ensureAudioPlaying = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1.0;
    setIsMuted(false);
    video.play().catch(() => {});
  };

  const toggleMute = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const currentVideo = videoRef.current;
    if (currentVideo) {
      const nextMuted = !currentVideo.muted;
      currentVideo.muted = nextMuted;
      currentVideo.defaultMuted = nextMuted;
      if (!nextMuted) {
        currentVideo.volume = 1.0;
        currentVideo.play().catch(() => {});
      }
      setIsMuted(nextMuted);
    }
  };

  // Playback & audio initialization effect (Strictly UNMUTED audio by default)
  useEffect(() => {
    console.log("Launching project reel:", project.title, project.videoUrl);

    const currentVideo = videoRef.current;
    if (!currentVideo) return;

    // Pause all other video elements in DOM
    document.querySelectorAll('video').forEach((v) => {
      if (v !== currentVideo) {
        v.pause();
      }
    });

    // Enforce unmuted full-volume audio by default
    currentVideo.muted = false;
    currentVideo.defaultMuted = false;
    currentVideo.volume = 1.0;
    setIsMuted(false);

    const playWithAudio = () => {
      currentVideo.muted = false;
      currentVideo.defaultMuted = false;
      currentVideo.volume = 1.0;
      setIsMuted(false);

      const playPromise = currentVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((err: Error) => {
          // If browser requires explicit interaction, keep muted=false so clicking play has audio!
          console.log('Unmuted playback pending direct tap:', err.name);
        });
      }
    };

    playWithAudio();

    currentVideo.addEventListener('loadeddata', playWithAudio);
    currentVideo.addEventListener('canplay', playWithAudio);

    return () => {
      currentVideo.removeEventListener('loadeddata', playWithAudio);
      currentVideo.removeEventListener('canplay', playWithAudio);
      currentVideo.pause();
    };
  }, [project.id, project.title, project.videoUrl]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Keyboard controls (Esc = back, Left/Right = nav, M = mute toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'Escape') {
        navigate('/');
      } else if (e.key === 'ArrowRight') {
        navigate(`/watch/${nextProject.id}`);
      } else if (e.key === 'ArrowLeft') {
        navigate(`/watch/${prevProject.id}`);
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, nextProject.id, prevProject.id]);

  const isVertical = project.aspectRatio === '9:16';

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-between selection:bg-orange-500 selection:text-black">
      {/* Background Cinematic Atmosphere */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-orange-500/[0.04] via-zinc-500/[0.02] to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#080808]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 hover:border-orange-500/40 text-xs sm:text-sm font-medium text-zinc-300 hover:text-white transition-all shadow-md group active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        {/* Center/Right Counter, Audio Toggle & Share */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={toggleMute}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
              isMuted
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20'
                : 'bg-white/[0.05] border-white/10 text-zinc-300 hover:bg-white/10'
            }`}
            title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
            aria-label={isMuted ? 'Turn Sound On' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-orange-400" />}
            <span className="hidden xs:inline">{isMuted ? 'Unmute' : 'Audio On'}</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-full">
            <Film size={12} className="text-orange-400" />
            <span>{currentIndex + 1} of {PROJECTS_DATA.length}</span>
          </span>

          <button
            onClick={handleCopyLink}
            className="p-2 rounded-full hover:bg-white/10 border border-white/[0.08] text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Share project link"
            aria-label="Share project link"
          >
            {copied ? <Check size={16} className="text-orange-400" /> : <Share2 size={16} />}
          </button>
        </div>
      </header>

      {/* Main Single-Video Playback Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Responsive Player Wrapper */}
        <div
          ref={containerRef}
          className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-white/[0.12] shadow-2xl flex items-center justify-center ${
            isVertical
              ? 'h-[64vh] sm:h-[72vh] max-h-[820px] aspect-[9/16]'
              : 'w-full max-w-5xl aspect-video'
          }`}
        >
          {criticalError ? (
            <div className="flex flex-col items-center justify-center text-center p-6 text-zinc-300 z-20">
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
            <div className="w-full h-full flex items-center justify-center p-4 relative">
              {/* Sleek Buffering & Loading Indicator */}
              {isBuffering && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none z-10 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin mb-3 shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
                  <span className="text-xs font-mono tracking-wider text-zinc-300 uppercase bg-black/75 px-3 py-1 rounded-full border border-white/10 shadow-lg">
                    Loading Reel...
                  </span>
                </div>
              )}

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
                muted={false}
                onClick={ensureAudioPlaying}
                onPlay={ensureAudioPlaying}
                onWaiting={() => setIsBuffering(true)}
                onLoadStart={() => setIsBuffering(true)}
                onPlaying={() => setIsBuffering(false)}
                onCanPlay={() => setIsBuffering(false)}
                onTimeUpdate={() => {
                  if (isBuffering) setIsBuffering(false);
                }}
                onVolumeChange={(e) => {
                  setIsMuted(e.currentTarget.muted);
                }}
                className={`w-full max-h-[80vh] ${
                  project.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]'
                } object-contain rounded-xl shadow-2xl bg-black cursor-pointer`}
                onLoadedMetadata={() => console.log('Stream ready with sound:', project.videoUrl)}
                onError={(e) => {
                  const currentTarget = e.currentTarget;
                  const currentSrc = currentTarget.currentSrc || currentTarget.src;
                  // If direct cluster fails, seamlessly fallback to canonical Archive.org redirector
                  if (currentSrc.includes('.us.archive.org/')) {
                    console.warn('Direct cluster failed, falling back to Archive redirector:', currentSrc);
                    currentTarget.src = currentSrc.replace(/https:\/\/[^/]+\/\d+\/items\//, 'https://archive.org/download/');
                    currentTarget.load();
                    currentTarget.play().catch(() => {});
                    return;
                  }
                  const mediaErr = currentTarget.error;
                  console.error('Video Error Object:', mediaErr);
                  // ONLY show error if an actual critical media decode error occurs
                  if (mediaErr && mediaErr.code === MediaError.MEDIA_ERR_DECODE) {
                    setCriticalError('Critical media decode error. Please try another video or browser.');
                  }
                }}
              />
            </div>
          )}
        </div>

        {/* Minimal Project Details & Quick Navigation Below Player */}
        <div className="w-full max-w-4xl mt-6 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#101013] border border-white/[0.08] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
              <span className="text-orange-400 uppercase tracking-wider font-semibold">
                {project.client}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-zinc-200 text-[10px] uppercase">
                {project.category}
              </span>
              <span>•</span>
              <span className="text-zinc-400">{project.year}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-300 text-[10px]">
                {project.duration}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-orange-500/10 border border-orange-500/30 text-orange-300 uppercase">
                {project.aspectRatio}
              </span>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                to={`/watch/${prevProject.id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/15 border border-white/10 hover:border-orange-500/30 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
                title={`Previous: ${prevProject.title}`}
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </Link>
              <Link
                to={`/watch/${nextProject.id}`}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 hover:text-black text-xs font-mono font-semibold transition-all shadow-md cursor-pointer"
                title={`Next: ${nextProject.title}`}
              >
                <span>Next Project</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-3">
            {project.title}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 border-t border-white/[0.08] text-center text-xs font-mono text-zinc-500">
        Directed & Edited by Oussama Brahami • {project.year}
      </footer>
    </div>
  );
};

export default WatchPage;
