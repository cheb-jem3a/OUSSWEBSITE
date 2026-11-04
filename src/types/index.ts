export type AspectRatio = '9:16' | '16:9';

export type ProjectCategory = 'commercials' | 'narrative' | 'reels';

export interface Project {
  id: string;
  title: string;
  client: string;
  category: ProjectCategory;
  aspectRatio: AspectRatio;
  year: string;
  role: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  vimeoOrYoutubeUrl?: string;
  description: string;
  metrics?: string;
  tags: string[];
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  stepNumber: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  icon: string;
}
