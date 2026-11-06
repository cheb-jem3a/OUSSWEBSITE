import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const FFMPEG_PATH = 'C:\\Users\\PcTec\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';

const projectsFile = path.join(rootDir, 'src/data/projects.ts');
const projectsContent = fs.readFileSync(projectsFile, 'utf8');
const projectUrls = [...projectsContent.matchAll(/videoUrl:\s*'([^']+)'/g)].map(m => m[1]);

const backupDir = path.join(rootDir, 'local_videos_backup');
const publicVideosDir = path.join(rootDir, 'public/videos');
const outputDir = path.join(rootDir, 'compressed_videos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all available local files
const localFiles = new Map();
if (fs.existsSync(backupDir)) {
  fs.readdirSync(backupDir).forEach(f => localFiles.set(f.toLowerCase(), path.join(backupDir, f)));
}
if (fs.existsSync(publicVideosDir)) {
  fs.readdirSync(publicVideosDir).forEach(f => localFiles.set(f.toLowerCase(), path.join(publicVideosDir, f)));
}

function compressVideo(inputFile, outputFile, isWidescreen) {
  return new Promise((resolve, reject) => {
    // If output already exists and > 500KB, skip to allow resume
    if (fs.existsSync(outputFile)) {
      const stat = fs.statSync(outputFile);
      if (stat.size > 500 * 1024) {
        console.log(`⏩ [Skipping] ${path.basename(outputFile)} already compressed (${(stat.size / 1024 / 1024).toFixed(2)} MB).`);
        return resolve({ skipped: true, sizeMB: stat.size / 1024 / 1024 });
      }
    }

    const scaleFilter = isWidescreen
      ? "scale='min(1920,iw)':-2"
      : "scale='min(1080,iw)':-2";

    const args = [
      '-y',
      '-i', inputFile,
      '-vf', scaleFilter,
      '-c:v', 'h264_mf',
      '-b:v', '2600k',
      '-movflags', '+faststart',
      '-c:a', 'aac',
      '-b:a', '128k',
      outputFile
    ];

    const proc = spawn(FFMPEG_PATH, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', d => { stderr += d.toString(); });

    proc.on('close', code => {
      if (code === 0 && fs.existsSync(outputFile)) {
        const outStat = fs.statSync(outputFile);
        resolve({ skipped: false, sizeMB: outStat.size / 1024 / 1024 });
      } else {
        // Fallback to libx264 if h264_mf fails on specific format
        const fallbackArgs = [
          '-y',
          '-i', inputFile,
          '-vf', scaleFilter,
          '-c:v', 'libx264',
          '-preset', 'veryfast',
          '-crf', '23',
          '-movflags', '+faststart',
          '-c:a', 'aac',
          '-b:a', '128k',
          outputFile
        ];
        const fbProc = spawn(FFMPEG_PATH, fallbackArgs, { stdio: 'ignore' });
        fbProc.on('close', fbCode => {
          if (fbCode === 0 && fs.existsSync(outputFile)) {
            const outStat = fs.statSync(outputFile);
            resolve({ skipped: false, sizeMB: outStat.size / 1024 / 1024 });
          } else {
            reject(new Error(`Failed to compress ${path.basename(inputFile)}: code ${code}/${fbCode}\n${stderr.slice(-300)}`));
          }
        });
      }
    });
  });
}

async function run() {
  console.log(`\n🎬 Starting batch compression of 51 videos with Intel hardware acceleration...\n`);
  let originalTotalBytes = 0;
  let compressedTotalBytes = 0;

  for (let i = 0; i < projectUrls.length; i++) {
    const url = projectUrls[i];
    const targetFilename = decodeURIComponent(url.split('/').pop());
    const isWidescreen = targetFilename.includes('architecture-graduation-2025');

    // Find input file
    let inputPath = localFiles.get(targetFilename.toLowerCase());
    if (!inputPath) {
      // Try fuzzy search
      for (const [key, val] of localFiles.entries()) {
        if (key.includes(targetFilename.toLowerCase()) || targetFilename.toLowerCase().includes(key)) {
          inputPath = val;
          break;
        }
      }
    }

    if (!inputPath) {
      console.error(`❌ [${i + 1}/${projectUrls.length}] Could not find local file for ${targetFilename}`);
      continue;
    }

    const inStat = fs.statSync(inputPath);
    originalTotalBytes += inStat.size;
    const outputPath = path.join(outputDir, targetFilename);

    const startTime = Date.now();
    process.stdout.write(`⏳ [${i + 1}/${projectUrls.length}] Compressing: ${targetFilename} (${(inStat.size / 1024 / 1024).toFixed(1)} MB)... `);

    try {
      const res = await compressVideo(inputPath, outputPath, isWidescreen);
      const outStat = fs.statSync(outputPath);
      compressedTotalBytes += outStat.size;
      const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
      const reduction = (((inStat.size - outStat.size) / inStat.size) * 100).toFixed(0);
      console.log(`✅ Done in ${durationSec}s! -> ${(outStat.size / 1024 / 1024).toFixed(1)} MB (-${reduction}%)`);
    } catch (err) {
      console.error(`\n❌ Error:`, err.message);
    }
  }

  const origMB = (originalTotalBytes / 1024 / 1024).toFixed(1);
  const compMB = (compressedTotalBytes / 1024 / 1024).toFixed(1);
  const totalSaved = (((originalTotalBytes - compressedTotalBytes) / originalTotalBytes) * 100).toFixed(0);

  console.log(`\n========================================`);
  console.log(`🎉 ALL 51 VIDEOS COMPRESSED!`);
  console.log(`📦 Original Size:   ${origMB} MB (~${(origMB / 1024).toFixed(2)} GB)`);
  console.log(`🚀 Compressed Size: ${compMB} MB`);
  console.log(`⚡ Total Reduction: -${totalSaved}%`);
  console.log(`📂 Folder:          ${outputDir}`);
  console.log(`========================================\n`);
}

run();
