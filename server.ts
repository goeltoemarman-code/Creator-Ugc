import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import {
  getOrCreateUser,
  getAllPosts,
  createNewPost,
  togglePostLike,
  addPostComment,
  deletePost,
} from './src/db/service.ts';
import { checkContentModeration } from './src/lib/moderation.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'cloudsql_postgresql' });
});

// Moderation test API (optional helper for debugging / quick validation)
app.post('/api/moderation/check', (req, res) => {
  const { text } = req.body;
  const result = checkContentModeration(text || '');
  res.json(result);
});

// 1. Get current logged-in user or sync from Firebase Auth
app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User token tidak terdeteksi' });
    }

    const { uid, email, name, picture } = req.user;
    const user = await getOrCreateUser(
      uid,
      email || '',
      name || req.body.name || 'Pengguna Komunitas',
      picture || req.body.avatarUrl
    );

    res.json({ user });
  } catch (error: any) {
    console.error('API /api/auth/sync error:', error);
    res.status(500).json({ error: error.message || 'Gagal sinkronisasi data user' });
  }
});

// 2. Fetch all UGC posts from PostgreSQL
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.json({ posts });
  } catch (error: any) {
    console.error('API /api/posts error:', error);
    res.status(500).json({ error: error.message || 'Gagal memuat feed postingan' });
  }
});

// 3. Create a new UGC post with Automatic Moderation (Requires Auth)
app.post('/api/posts', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Silakan masuk terlebih dahulu untuk mempublikasikan konten.' });
    }

    const { content, category, tags, mediaUrl } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Konten postingan tidak boleh kosong.' });
    }

    // Server-side Automatic Moderation Filter Check
    const moderation = checkContentModeration(content);
    if (!moderation.isClean) {
      return res.status(400).json({
        error: `Konten ditolak oleh sistem moderasi otomatis: terdeteksi kata tidak pantas (${moderation.flaggedWords.join(', ')}). Mohon gunakan bahasa yang sopan.`,
        flaggedWords: moderation.flaggedWords,
        sanitizedText: moderation.sanitizedText,
      });
    }

    // Ensure user exists in PostgreSQL
    const dbUser = await getOrCreateUser(
      req.user.uid,
      req.user.email || '',
      req.user.name || 'Pengguna Komunitas',
      req.user.picture
    );

    const newPost = await createNewPost(
      dbUser.id,
      content.trim(),
      category,
      tags || [],
      mediaUrl
    );

    res.status(201).json({ post: newPost, message: 'Postingan berhasil diterbitkan dan lolos moderasi!' });
  } catch (error: any) {
    console.error('API POST /api/posts error:', error);
    res.status(400).json({ error: error.message || 'Gagal menerbitkan postingan' });
  }
});

// 4. Toggle Like on a post (Requires Auth)
app.post('/api/posts/:postId/like', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Silakan masuk untuk menyukai postingan.' });
    }

    const { postId } = req.params;
    const dbUser = await getOrCreateUser(
      req.user.uid,
      req.user.email || '',
      req.user.name || 'Pengguna Komunitas'
    );

    const result = await togglePostLike(postId, dbUser.id);
    res.json(result);
  } catch (error: any) {
    console.error('API POST /api/posts/:postId/like error:', error);
    res.status(500).json({ error: error.message || 'Gagal memproses like' });
  }
});

// 5. Add a comment to a post with Automatic Moderation (Requires Auth)
app.post('/api/posts/:postId/comments', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Silakan masuk untuk berkomentar.' });
    }

    const { postId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Teks komentar tidak boleh kosong.' });
    }

    // Moderation check on comment
    const moderation = checkContentModeration(text);
    if (!moderation.isClean) {
      return res.status(400).json({
        error: `Komentar ditolak oleh moderasi otomatis: terdeteksi kata (${moderation.flaggedWords.join(', ')}). Harap berkomentar dengan bijak.`,
        flaggedWords: moderation.flaggedWords,
        sanitizedText: moderation.sanitizedText,
      });
    }

    const dbUser = await getOrCreateUser(
      req.user.uid,
      req.user.email || '',
      req.user.name || 'Pengguna Komunitas'
    );

    const comment = await addPostComment(postId, dbUser.id, text.trim());
    res.status(201).json({ comment, message: 'Komentar berhasil dikirim!' });
  } catch (error: any) {
    console.error('API POST /api/posts/:postId/comments error:', error);
    res.status(400).json({ error: error.message || 'Gagal menambahkan komentar' });
  }
});

// 6. Delete a post (Requires Auth & Author ownership)
app.delete('/api/posts/:postId', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Silakan masuk untuk menghapus postingan.' });
    }

    const { postId } = req.params;
    const dbUser = await getOrCreateUser(
      req.user.uid,
      req.user.email || '',
      req.user.name || 'Pengguna Komunitas'
    );

    const result = await deletePost(postId, dbUser.id);
    res.json(result);
  } catch (error: any) {
    console.error('API DELETE /api/posts/:postId error:', error);
    const status = error.message?.includes('Akses ditolak') ? 403 : 400;
    res.status(status).json({ error: error.message || 'Gagal menghapus postingan' });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE / SPA FALLBACK
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server UGC Full-Stack aktif di http://0.0.0.0:${PORT}`);
  });
}

startServer();
