import { Post, User } from '../types';

export const CURRENT_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Budi Prakoso',
    handle: '@budiprakoso',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Junior Web Developer & Tech Enthusiast dari Jakarta.',
  },
  {
    id: 'user-2',
    name: 'Siti Rahma',
    handle: '@sitirahma_ui',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Product Designer yang suka berbagi tips estetika & layout.',
  },
  {
    id: 'user-3',
    name: 'Dimas Wicaksono',
    handle: '@dimas_lens',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Fotografer jalanan & penikmat kopi senja.',
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    author: CURRENT_USERS[1],
    content: 'Prinsip desain visual paling penting saat merancang aplikasi web: berikan ruang bernapas (whitespace) yang cukup! Jangan padatkan semua tombol dan teks dalam satu sudut. Desain minimalis membuat mata pengguna lebih fokus pada informasi utama.',
    mediaUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
    category: 'Desain UI/UX',
    tags: ['desain', 'uiux', 'tipsweb', 'minimalis'],
    likes: 24,
    isLiked: false,
    isBookmarked: false,
    createdAt: '15 menit yang lalu',
    comments: [
      {
        id: 'c-1',
        author: CURRENT_USERS[0],
        text: 'Setuju banget Kak Siti! Spacing dan typography hierarchy sering disepelekan pemula padahal dampaknya besar.',
        createdAt: '10 menit yang lalu',
      },
    ],
  },
  {
    id: 'post-2',
    author: CURRENT_USERS[0],
    content: 'Hari ini saya baru selesai merilis komponen pertama untuk aplikasi User Generated Content (UGC)! Rasanya senang sekali melihat alur data dari form langsung muncul ke feed secara interaktif. Langkah selanjutnya adalah menyambungkan ke backend API & database cloud.',
    category: 'Teknologi',
    tags: ['react', 'webdev', 'fullstack', 'ugc'],
    likes: 18,
    isLiked: false,
    isBookmarked: false,
    createdAt: '1 jam yang lalu',
    comments: [
      {
        id: 'c-2',
        author: CURRENT_USERS[2],
        text: 'Semangat belajarnya Mas Budi! Terus berkarya.',
        createdAt: '45 menit yang lalu',
      },
    ],
  },
  {
    id: 'post-3',
    author: CURRENT_USERS[2],
    content: 'Menangkap momen matahari terbit di atas perbukitan pagi ini. Fotografi landscape selalu mengajarkan kita untuk sabar menunggu pencahayaan alami yang sempurna (golden hour). Bagaimana pemandangan pagi di kota teman-teman?',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    category: 'Fotografi',
    tags: ['landscape', 'sunrise', 'goldenhour', 'alam'],
    likes: 42,
    isLiked: false,
    isBookmarked: false,
    createdAt: '3 jam yang lalu',
    comments: [],
  },
];

export const CATEGORIES: { id: string; label: string }[] = [
  { id: 'Semua', label: 'Semua' },
  { id: 'Teknologi', label: 'Teknologi' },
  { id: 'Desain UI/UX', label: 'Desain UI/UX' },
  { id: 'Fotografi', label: 'Fotografi' },
  { id: 'Tutorial', label: 'Tutorial' },
  { id: 'Inspirasi', label: 'Inspirasi' },
];

export const SAMPLE_IMAGE_PRESETS = [
  { label: 'Laptop & Coding', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80' },
  { label: 'Desain & Sketsa', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80' },
  { label: 'Alam & Sunset', url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Kopi & Workspace', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80' },
];
