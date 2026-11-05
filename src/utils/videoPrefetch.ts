// Dedicated video prefetching utility for high-speed instant playback
const prefetchedLinks = new Set<string>();

/**
 * Pre-warms DNS, TLS, and starts prefetching the initial media chunk
 * whenever the user hovers over or touches a video card.
 */
export function prefetchVideo(videoUrl?: string) {
  if (!videoUrl || typeof document === 'undefined') return;

  const cleanUrl = encodeURI(videoUrl).replace(/#/g, '%23');
  if (prefetchedLinks.has(cleanUrl)) return;
  prefetchedLinks.add(cleanUrl);

  try {
    // 1. Browser media preload hint
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'video';
    link.href = cleanUrl;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    // 2. HTTP Byte-Range prefetch of the first 512KB (covers mp4 header & first 1-2 sec of playback)
    fetch(cleanUrl, {
      headers: { Range: 'bytes=0-524287' },
      mode: 'cors',
      cache: 'force-cache'
    }).catch(() => {
      // Non-fatal background prefetch failure
    });
  } catch {
    // Silent fail
  }
}
