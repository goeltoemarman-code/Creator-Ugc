export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
}

export interface Comment {
  id: string;
  author: User;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  mediaUrl?: string;
  category: string;
  tags: string[];
  likes: number;
  isLiked: boolean;
  isBookmarked: boolean;
  comments: Comment[];
  createdAt: string;
}

export type Category = 'Semua' | 'Teknologi' | 'Desain UI/UX' | 'Fotografi' | 'Tutorial' | 'Inspirasi';

export type SortOption = 'latest' | 'popular';
