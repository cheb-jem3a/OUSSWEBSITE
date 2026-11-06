import fs from 'fs';
import path from 'path';

async function testSuite() {
  console.log('=== 1. VERIFYING PROJECTS DATA ===');
  const code = fs.readFileSync('src/data/projects.ts', 'utf8');
  const urls = [...code.matchAll(/videoUrl:\s*'([^']+)'/g)].map(m => m[1]);
  console.log(`Total projects configured: ${urls.length}`);

  console.log('\n=== 2. VERIFYING ALL 51 FAST VIDEO URLS VIA HTTP HEAD ===');
  let ok = 0;
  const failed = [];
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    try {
      const res = await fetch(u, { method: 'HEAD' });
      if (res.status === 200 || res.status === 206) {
        ok++;
      } else {
        failed.push({ index: i + 1, url: u, status: res.status });
      }
    } catch (e) {
      failed.push({ index: i + 1, url: u, error: e.message });
    }
  }
  console.log(`Fast Video URLs: OK = ${ok}/${urls.length}, Failed = ${failed.length}`);
  if (failed.length) console.log('Failures:', failed);

  console.log('\n=== 3. VERIFYING HERO PHONE MOCKUP VIDEO ===');
  const heroCode = fs.readFileSync('src/components/Hero.tsx', 'utf8');
  const heroMatch = heroCode.match(/videoUrl="([^"]+)"/);
  if (heroMatch) {
    const heroUrl = heroMatch[1];
    const heroRes = await fetch(heroUrl, { method: 'HEAD' });
    const mb = (Number(heroRes.headers.get('content-length')) / 1024 / 1024).toFixed(1);
    console.log(`Hero Video URL: ${heroUrl}`);
    console.log(`Hero Video Status: HTTP ${heroRes.status} | Type: ${heroRes.headers.get('content-type')} | Size: ${mb} MB`);
  }

  console.log('\n=== 4. VERIFYING ABOUT SECTION PHOTO ===');
  const aboutRes = await fetch('https://ousswebsite.vercel.app/about.jpg', { method: 'HEAD' });
  console.log(`About Photo Live Status: HTTP ${aboutRes.status} | Type: ${aboutRes.headers.get('content-type')} | Size: ${aboutRes.headers.get('content-length')} bytes`);

  console.log('\n=== 5. VERIFYING LIVE VERCEL SPA ROUTES ===');
  const routes = [
    'https://ousswebsite.vercel.app/',
    'https://ousswebsite.vercel.app/watch/architecture-graduation-2025',
    'https://ousswebsite.vercel.app/watch/reel-1-ramadan',
    'https://ousswebsite.vercel.app/watch/reel-24-eps-land'
  ];
  for (const r of routes) {
    const res = await fetch(r, { method: 'HEAD' });
    console.log(`${r} -> HTTP ${res.status}`);
  }

  console.log('\n=== 6. VERIFYING THUMBNAIL SAMPLES ON VERCEL ===');
  const thumbs = [
    'https://ousswebsite.vercel.app/thumbnails/architecture-graduation-2025.webp',
    'https://ousswebsite.vercel.app/thumbnails/reel-1.webp',
    'https://ousswebsite.vercel.app/thumbnails/reel-24.webp'
  ];
  for (const t of thumbs) {
    const res = await fetch(t, { method: 'HEAD' });
    console.log(`${t.split('/').pop()} -> HTTP ${res.status}`);
  }
}

testSuite();
