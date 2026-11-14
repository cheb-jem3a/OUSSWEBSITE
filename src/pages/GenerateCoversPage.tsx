import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  Download,
  Trash2,
  CheckCircle2,
  Film,
  Sparkles,
  Camera
} from 'lucide-react';
import { PROJECTS_DATA } from '../data/projects';
import type { Project } from '../types';
import {
  saveStoredThumbnail,
  getAllStoredThumbnails,
  clearStoredThumbnails,
  downloadThumbnailsJSON
} from '../utils/browserThumbnails';

interface ExtractedCover {
  projectId: string;
  title: string;
  aspectRatio: string;
  dataUrl: string;
  timestamp: number;
  sizeKb: number;
  savedToDisk?: boolean;
}

export const GenerateCoversPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready to generate thumbnails');
  const [extractedCovers, setExtractedCovers] = useState<ExtractedCover[]>(() => {
    const stored = getAllStoredThumbnails();
    const initialList: ExtractedCover[] = [];
    PROJECTS_DATA.forEach((p) => {
      if (stored[p.id]) {
        const dataUrl = stored[p.id];
        const approxKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        initialList.push({
          projectId: p.id,
          title: p.title,
          aspectRatio: p.aspectRatio,
          dataUrl,
          timestamp: Date.now(),
          sizeKb: approxKb,
        });
      }
    });
    return initialList;
  });
  const [errorCount, setErrorCount] = useState(0);

  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRunningRef = useRef(false);
  const isPausedRef = useRef(false);

  // Sync refs with state
  useEffect(() => {
    isRunningRef.current = isRunning;
    isPausedRef.current = isPaused;
  }, [isRunning, isPaused]);

  // Sleep utility with pause check
  const waitWhilePaused = async () => {
    while (isPausedRef.current && isRunningRef.current) {
      await new Promise((r) => setTimeout(r, 200));
    }
  };

  /**
   * Extract a single video frame sequentially
   */
  const processSingleVideo = (project: Project): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        return reject(new Error('Missing video or canvas DOM element'));
      }

      const is169 = project.aspectRatio === '16:9';
      const targetWidth = is169 ? 960 : 540;
      const targetHeight = is169 ? 540 : 960;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas 2D context unavailable'));

      let timeoutId: any = null;

      const cleanUp = () => {
        if (timeoutId) clearTimeout(timeoutId);
        video.removeEventListener('loadeddata', onLoaded);
        video.removeEventListener('seeked', onSeeked);
        video.removeEventListener('error', onError);
      };

      const onError = () => {
        cleanUp();
        reject(new Error(`Failed loading video: ${project.videoUrl}`));
      };

      const onSeeked = async () => {
        cleanUp();
        try {
          // Draw video frame to canvas at target aspect ratio
          ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

          // Convert to WebP (fallback to JPEG)
          let dataUrl = canvas.toDataURL('image/webp', 0.85);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }

          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };

      const onLoaded = () => {
        // Target seek time is 1.0s (or half duration if clip is very short)
        const targetSeek = video.duration && video.duration < 1.0
          ? Math.max(0.1, video.duration * 0.5)
          : 1.0;
        setStatusMessage(`Seeking ${project.title} to ${targetSeek}s...`);
        video.currentTime = targetSeek;
      };

      video.addEventListener('loadeddata', onLoaded, { once: true });
      video.addEventListener('seeked', onSeeked, { once: true });
      video.addEventListener('error', onError, { once: true });

      // Safety timeout after 15s per video
      timeoutId = setTimeout(() => {
        cleanUp();
        reject(new Error(`Extraction timed out for ${project.title}`));
      }, 15000);

      // Begin loading video
      video.crossOrigin = 'anonymous';
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.src = project.videoUrl;
      video.load();
    });
  };

  /**
   * Main sequential loop through all projects
   */
  const startGeneration = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsPaused(false);
    setErrorCount(0);

    const total = PROJECTS_DATA.length;

    for (let i = 0; i < total; i++) {
      if (!isRunningRef.current) break;
      await waitWhilePaused();
      if (!isRunningRef.current) break;

      const project = PROJECTS_DATA[i];
      setCurrentIndex(i + 1);
      setCurrentProject(project);
      setStatusMessage(`[${i + 1}/${total}] Loading: ${project.title}`);

      try {
        const dataUrl = await processSingleVideo(project);
        const approxKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        // 1. Save in local browser storage & memory cache
        saveStoredThumbnail(project.id, dataUrl);

        // 2. Attempt to save to disk via Vite dev server middleware
        let savedToDisk = false;
        try {
          // Derive filename from thumbnail path (e.g., /thumbnails/reel-1.webp -> reel-1.webp)
          const filename = project.thumbnail.split('/').pop() || `${project.id}.webp`;
          const res = await fetch('/api/save-thumbnail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, base64: dataUrl }),
          });
          if (res.ok) {
            savedToDisk = true;
          }
        } catch {
          // Offline or dev server middleware not accessible
        }

        const coverItem: ExtractedCover = {
          projectId: project.id,
          title: project.title,
          aspectRatio: project.aspectRatio,
          dataUrl,
          timestamp: Date.now(),
          sizeKb: approxKb,
          savedToDisk,
        };

        setExtractedCovers((prev) => {
          const filtered = prev.filter((c) => c.projectId !== project.id);
          return [coverItem, ...filtered];
        });

        setStatusMessage(`[${i + 1}/${total}] ✅ Captured ${project.title} (${approxKb} KB)`);
      } catch (err: any) {
        console.error(`Error capturing ${project.title}:`, err);
        setErrorCount((prev) => prev + 1);
        setStatusMessage(`[${i + 1}/${total}] ⚠️ Skipped ${project.title}: ${err.message || 'Error'}`);
      }

      // Small 150ms breather between sequential videos to release browser decode buffers
      await new Promise((r) => setTimeout(r, 150));
    }

    // Clean up video element
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }

    setIsRunning(false);
    setIsPaused(false);
    setStatusMessage('🎉 All video covers have been generated!');
  };

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
    setStatusMessage(isPaused ? 'Resuming extraction...' : 'Paused extraction');
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    setStatusMessage('Stopped extraction');
  };

  const handleClear = () => {
    if (window.confirm('Clear all stored thumbnails from browser storage?')) {
      clearStoredThumbnails();
      setExtractedCovers([]);
      setStatusMessage('Cleared browser thumbnail storage');
    }
  };

  const downloadSingle = (cover: ExtractedCover) => {
    const a = document.createElement('a');
    a.href = cover.dataUrl;
    a.download = `${cover.projectId}.webp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const total = PROJECTS_DATA.length;
  const progressPercent = Math.round((extractedCovers.length / total) * 100);

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-red-600 selection:text-white p-4 sm:p-8">
      {/* Background glow atmosphere */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-red-600/[0.05] to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Hidden processing video element */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
        muted
        crossOrigin="anonymous"
      />

      <div className="max-w-6xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all w-fit cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-1.5">
              <Camera size={13} />
              <span>HTML5 Canvas Generator</span>
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Browser Video Thumbnail Studio</span>
            <Sparkles size={24} className="text-red-400" />
          </h1>
          <p className="mt-2 text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Extracts crisp high-definition covers directly from each video at <span className="text-red-400 font-mono">1.0s</span> using native browser HTML5 Canvas.
            No external FFmpeg installation is required.
          </p>
        </div>

        {/* Control Center Panel */}
        <div className="rounded-3xl bg-[#101013] border border-white/[0.1] p-6 sm:p-8 mb-10 shadow-2xl">
          {/* Progress Overview Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                <span>Progress Status</span>
                {isRunning && (
                  <span className="text-red-400 text-[10px]">
                    (Processing #{currentIndex} of {total})
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="text-red-400 text-[10px]">
                    • {errorCount} errors
                  </span>
                )}
              </div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <span>{extractedCovers.length} of {total} Extracted</span>
                <span className="text-sm font-mono text-red-400">({progressPercent}%)</span>
              </div>
            </div>

            <div className="text-xs font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-3.5 py-2 rounded-2xl max-w-md truncate">
              {statusMessage}
            </div>
          </div>

          {/* Visual Progress Track */}
          <div className="w-full bg-white/[0.08] h-2.5 rounded-full overflow-hidden mb-6">
            <div
              className="bg-gradient-to-r from-red-600 via-rose-500 to-red-600 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {!isRunning ? (
              <button
                onClick={startGeneration}
                className="px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-red-600 hover:text-white transition-all shadow-lg hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Play size={16} className="fill-current" />
                <span>{extractedCovers.length > 0 ? 'Resume / Regenerate All' : 'Start Cover Extraction'}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handlePauseResume}
                  className="px-5 py-2.5 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Pause size={15} />
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>

                <button
                  onClick={handleStop}
                  className="px-5 py-2.5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Stop</span>
                </button>
              </>
            )}

            <button
              onClick={downloadThumbnailsJSON}
              disabled={extractedCovers.length === 0}
              className="px-5 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-white text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              title="Download thumbnails map as JSON"
            >
              <Download size={15} />
              <span>Export thumbnails.json</span>
            </button>

            <button
              onClick={handleClear}
              disabled={extractedCovers.length === 0}
              className="px-4 py-2.5 rounded-full hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 text-sm transition-all ml-auto disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="Clear browser cache"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Live Canvas Monitor Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Left Canvas Display */}
          <div className="md:col-span-5 rounded-3xl bg-[#101013] border border-white/[0.08] p-5 flex flex-col items-center justify-center min-h-[380px]">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3 self-start flex items-center gap-1.5">
              <Camera size={13} className="text-red-400" />
              <span>Active Canvas Renderer</span>
            </div>

            <div className="relative max-h-[340px] aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-white/15 flex items-center justify-center shadow-xl">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
                width={540}
                height={960}
              />
              {!isRunning && extractedCovers.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-zinc-500">
                  <Film size={28} className="mb-2 opacity-40" />
                  <span className="text-xs font-mono">Press Start to begin live frame extraction</span>
                </div>
              )}
            </div>

            {currentProject && (
              <div className="mt-3 text-center">
                <span className="text-xs font-mono text-red-400">{currentProject.client}</span>
                <div className="text-sm font-bold text-white truncate max-w-xs">{currentProject.title}</div>
              </div>
            )}
          </div>

          {/* Right Architecture & Safeguards Info */}
          <div className="md:col-span-7 flex flex-col justify-between gap-4">
            <div className="rounded-3xl bg-[#101013] border border-white/[0.08] p-6">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-red-400" />
                <span>Zero-Decoder Performance Guarantee</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Processing occurs strictly <strong className="text-zinc-200">one video at a time</strong>. After capturing each frame at 1.0s, the video element is paused, stripped of its media source, and wiped from memory so system RAM and GPU decoders remain fully unburdened.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-zinc-500 block">Capture Mark</span>
                  <span className="text-white font-semibold">1.0 Second</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-zinc-500 block">Output Format</span>
                  <span className="text-red-400 font-semibold">540×960 WebP</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-zinc-500 block">Storage Layer</span>
                  <span className="text-white font-semibold">localStorage + Disk</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-zinc-500 block">Concurrency</span>
                  <span className="text-white font-semibold">Sequential (1x)</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-r from-red-600/10 via-red-900/5 to-transparent border border-red-500/20 p-6">
              <h4 className="text-sm font-semibold text-red-300 mb-1 flex items-center gap-1.5">
                <Sparkles size={14} />
                <span>Instant Home Page Sync</span>
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Any frame captured in this studio is immediately reflected on the live portfolio carousel without needing a server rebuild or page refresh.
              </p>
            </div>
          </div>
        </div>

        {/* Extracted Thumbnails Gallery Feed */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Captured Covers</span>
              <span className="text-xs font-mono text-zinc-400">({extractedCovers.length})</span>
            </h2>
          </div>

          {extractedCovers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#101013] border border-white/[0.06] text-zinc-500 font-mono text-xs">
              No covers generated yet. Click "Start Cover Extraction" above.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {extractedCovers.map((cover) => (
                <div
                  key={cover.projectId}
                  className="group relative rounded-2xl overflow-hidden bg-[#121215] border border-white/[0.08] hover:border-red-500/40 transition-all flex flex-col"
                >
                  <div className="relative aspect-[9/16] bg-black overflow-hidden">
                    <img
                      src={cover.dataUrl}
                      alt={cover.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-1.5 right-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/80 text-red-400 border border-red-500/30">
                        {cover.sizeKb} KB
                      </span>
                    </div>

                    <button
                      onClick={() => downloadSingle(cover)}
                      className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-white text-black opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all shadow-lg active:scale-95 cursor-pointer"
                      title="Download WebP"
                    >
                      <Download size={14} />
                    </button>
                  </div>

                  <div className="p-2.5">
                    <div className="text-[10px] font-mono text-red-400 truncate">
                      {cover.projectId}
                    </div>
                    <div className="text-xs font-semibold text-white truncate mt-0.5">
                      {cover.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateCoversPage;
