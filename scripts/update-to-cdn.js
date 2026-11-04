import fs from 'fs';

const filePath = 'src/data/projects.ts';
let content = fs.readFileSync(filePath, 'utf8');

const GITHUB_CDN = 'https://github.com/cheb-jem3a/OUSSWEBSITE/releases/download/v1.0-videos';
const ARCHIVE_CDN = 'https://archive.org/download/oussama-brahami-portfolio-reels';

// Replace GitHub release URLs with Archive.org streaming CDN
content = content.replaceAll(GITHUB_CDN, ARCHIVE_CDN);
// Also replace any leftover '/videos/'
content = content.replaceAll("videoUrl: '/videos/", `videoUrl: '${ARCHIVE_CDN}/`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated all video URLs to Archive.org Streaming CDN.');
