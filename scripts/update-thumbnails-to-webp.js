import fs from 'fs';

let content = fs.readFileSync('src/data/projects.ts', 'utf8');

// Replace all /thumbnails/*.jpg with /thumbnails/*.webp
content = content.replace(/\/thumbnails\/(.+?)\.jpg/g, '/thumbnails/$1.webp');

fs.writeFileSync('src/data/projects.ts', content, 'utf8');
console.log('Updated projects.ts thumbnails to .webp!');
