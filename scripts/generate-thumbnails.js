import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const videosDir = path.join(rootDir, 'public', 'videos');
const thumbnailsDir = path.join(rootDir, 'public', 'thumbnails');

// Resolve FFmpeg executable
async function getFfmpegPath() {
  try {
    const ffmpegStatic = await import('ffmpeg-static');
    if (ffmpegStatic.default && fs.existsSync(ffmpegStatic.default)) {
      return ffmpegStatic.default;
    }
  } catch {
    // fallback to system ffmpeg
  }
  return 'ffmpeg';
}

// Concurrency pool runner
async function runPool(items, concurrency, fn) {
  let index = 0;
  const results = [];
  const total = items.length;

  async function worker() {
    while (index < total) {
      const currentIndex = index++;
      const item = items[currentIndex];
      try {
        const res = await fn(item, currentIndex + 1, total);
        results.push(res);
      } catch (err) {
        console.error(`❌ Failed processing ${item}:`, err.message);
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, total) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log('🎬 [Oussama Brahami Portfolio] Automated Poster Thumbnail Generator');
  console.log('==================================================================');

  const ffmpeg = await getFfmpegPath();
  console.log(`Using FFmpeg at: ${ffmpeg}`);

  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
    console.log(`Created thumbnails directory: ${thumbnailsDir}`);
  }

  if (!fs.existsSync(videosDir)) {
    console.error(`Videos directory not found at: ${videosDir}`);
    process.exit(1);
  }

  // Get all mp4 files in public/videos
  const allFiles = fs.readdirSync(videosDir);
  const mp4Files = allFiles.filter(f => f.toLowerCase().endsWith('.mp4'));

  // Prioritize primary project files (architecture graduation + reels 1 to 50)
  const priorityFiles = [
    'architecture-graduation-2025.mp4',
    ...Array.from({ length: 50 }, (_, i) => `reel-${i + 1}.mp4`)
  ];

  // Combine and deduplicate
  const queueFiles = [
    ...priorityFiles.filter(f => fs.existsSync(path.join(videosDir, f))),
    ...mp4Files.filter(f => !priorityFiles.includes(f))
  ];

  console.log(`Scanning ${queueFiles.length} videos from: ${videosDir}`);
  console.log(`Target frame mark: 1.5s -> formats: .webp & .jpg\n`);

  const startTime = Date.now();

  const extractFrame = (file, current, total) => {
    return new Promise((resolve, reject) => {
      const inputPath = path.join(videosDir, file);
      const baseName = path.parse(file).name;
      const outputWebp = path.join(thumbnailsDir, `${baseName}.webp`);
      const outputJpg = path.join(thumbnailsDir, `${baseName}.jpg`);

      // Extract high-quality WebP frame at 1.5s
      const argsWebp = [
        '-ss', '00:00:01.500',
        '-i', inputPath,
        '-frames:v', '1',
        '-q:v', '2',
        '-y',
        outputWebp
      ];

      execFile(ffmpeg, argsWebp, (errWebp) => {
        if (errWebp) {
          return reject(errWebp);
        }

        // Also ensure .jpg exists for universal fallback
        if (!fs.existsSync(outputJpg)) {
          const argsJpg = [
            '-ss', '00:00:01.500',
            '-i', inputPath,
            '-frames:v', '1',
            '-q:v', '2',
            '-y',
            outputJpg
          ];
          execFile(ffmpeg, argsJpg, () => {
            const stats = fs.statSync(outputWebp);
            const sizeKb = (stats.size / 1024).toFixed(1);
            console.log(`[${current}/${total}] ✅ ${baseName}.webp (${sizeKb} KB)`);
            resolve(outputWebp);
          });
        } else {
          const stats = fs.statSync(outputWebp);
          const sizeKb = (stats.size / 1024).toFixed(1);
          console.log(`[${current}/${total}] ✅ ${baseName}.webp (${sizeKb} KB)`);
          resolve(outputWebp);
        }
      });
    });
  };

  // Run with 4 concurrent processes for fast, smooth extraction
  const results = await runPool(queueFiles, 4, extractFrame);

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n==================================================================');
  console.log(`🎉 Successfully generated ${results.length} WebP thumbnails in ${durationSec}s!`);
  console.log(`📂 Location: ${thumbnailsDir}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
