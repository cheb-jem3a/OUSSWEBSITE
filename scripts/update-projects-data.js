import fs from 'fs';

let content = fs.readFileSync('src/data/projects.ts', 'utf8');

// Replace architecture graduation thumbnail
content = content.replace(
  "thumbnail: '/videos/architecture-graduation-2025.mp4#t=2.0'",
  "thumbnail: '/thumbnails/architecture-graduation-2025.jpg'"
);

// Replace reel thumbnails
content = content.replace(/thumbnail:\s*'\/videos\/reel-(\d+)\.mp4#t=1\.5'/g, "thumbnail: '/thumbnails/reel-$1.jpg'");

fs.writeFileSync('src/data/projects.ts', content, 'utf8');
console.log('src/data/projects.ts updated successfully!');
