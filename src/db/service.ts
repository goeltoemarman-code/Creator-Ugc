import { db } from './index.ts';
import { users, posts, comments, likes } from './schema.ts';
import { eq, desc, asc, sql, count } from 'drizzle-orm';
import { checkContentModeration } from '../lib/moderation.ts';

// 1. Get or register user based on Firebase Auth token data
export async function getOrCreateUser(
  uid: string,
  email: string,
  name: string,
  avatarUrl?: string
) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid));
    if (existing.length > 0) {
      return existing[0];
    }

    // Generate handle from email or name
    const rawHandle = email ? email.split('@')[0] : `user_${Date.now()}`;
    const handle = `@${rawHandle.toLowerCase().replace(/[^a-z0-9_]/g, '')}`;

    const inserted = await db
      .insert(users)
      .values({
        uid,
        email: email || `${uid}@kreatorhub.internal`,
        name: name || rawHandle,
        handle,
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'Kreator di Platform UGC',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          name: name || rawHandle,
          email: email || `${uid}@kreatorhub.internal`,
          avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          updatedAt: new Date(),
        },
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Gagal memproses data pengguna.', { cause: error });
  }
}

// 2. Seed initial posts if the database is brand new
export async function seedInitialPostsIfNeeded() {
  try {
    const totalPosts = await db.select({ val: count() }).from(posts);
    if (Number(totalPosts[0]?.val || 0) > 0) {
      return;
    }

    // Create system / demo community creators
    const seedAuthor1 = await getOrCreateUser(
      'demo_creator_dimas',
      'dimas.aditya@ugc.com',
      'Dimas Aditya',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    );

    const seedAuthor2 = await getOrCreateUser(
      'demo_creator_sarah',
      'sarah.lestari@ugc.com',
      'Sarah Lestari',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    );

    const seedAuthor3 = await getOrCreateUser(
      'demo_creator_rizky',
      'rizky.maulana@ugc.com',
      'Rizky Maulana',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    );

    // Insert 3 initial seed posts
    const [p1] = await db
      .insert(posts)
      .values({
        authorId: seedAuthor1.id,
        content: 'Baru saja migrasi database UGC ke Cloud SQL PostgreSQL! 🚀 Performa query relasional, integritas data, dan dukungan connection pool-nya benar-benar stabil untuk aplikasi skala produksi.',
        mediaUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        category: 'Teknologi',
        tags: ['cloudsql', 'postgresql', 'drizzle', 'fullstack'],
        likesCount: 12,
        commentsCount: 2,
      })
      .returning();

    const [p2] = await db
      .insert(posts)
      .values({
        authorId: seedAuthor2.id,
        content: 'Menjaga kenyamanan komunitas online itu penting. Sistem moderasi otomatis membantu menyaring konten bernada kasar sehingga diskusi tetap sehat dan edukatif bagi semua kreator.',
        mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
        category: 'Desain & Kreatif',
        tags: ['komunitas', 'moderasi', 'ugc', 'kreator'],
        likesCount: 8,
        commentsCount: 1,
      })
      .returning();

    const [p3] = await db
      .insert(posts)
      .values({
        authorId: seedAuthor3.id,
        content: 'Tips produktivitas kreator: Mulailah dari membuat draf ide kecil setiap hari. Konsistensi mengalahkan kesempurnaan. Siapa yang sedang mengerjakan proyek baru minggu ini?',
        category: 'Produktivitas',
        tags: ['produktivitas', 'tips', 'semangat'],
        likesCount: 5,
        commentsCount: 0,
      })
      .returning();

    // Insert initial comments
    if (p1 && seedAuthor2) {
      await db.insert(comments).values([
        {
          postId: p1.id,
          authorId: seedAuthor2.id,
          text: 'Keren banget Mas Dimas! Cloud SQL memang andal untuk relasi antar user dan konten.',
        },
        {
          postId: p1.id,
          authorId: seedAuthor3.id,
          text: 'Setuju! Drizzle ORM juga membuat query SQL jauh lebih aman dan cepat.',
        },
      ]);
    }

    if (p2 && seedAuthor1) {
      await db.insert(comments).values([
        {
          postId: p2.id,
          authorId: seedAuthor1.id,
          text: 'Betul sekali, filter otomatis kata kasar membuat ruang bertukar pikiran tetap positif.',
        },
      ]);
    }

    console.log('Initial posts successfully seeded into Cloud SQL PostgreSQL!');
  } catch (error) {
    console.error('Notice: seeding initial posts encountered an issue:', error);
  }
}

// 3. Fetch all posts with author info, likes, and comments
export async function getAllPosts() {
  try {
    await seedInitialPostsIfNeeded();

    const allPosts = await db.query.posts.findMany({
      orderBy: [desc(posts.createdAt)],
      with: {
        author: true,
        likes: true,
        comments: {
          with: {
            author: true,
          },
          orderBy: [asc(comments.createdAt)],
        },
      },
    });
    return allPosts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Gagal mengambil daftar konten dari database.', { cause: error });
  }
}

// 4. Create a new post with moderation verification
export async function createNewPost(
  authorId: string,
  content: string,
  category: string,
  tags: string[],
  mediaUrl?: string
) {
  try {
    // Moderation check
    const moderation = checkContentModeration(content);
    if (!moderation.isClean) {
      throw new Error(
        `Konten ditolak oleh sistem moderasi otomatis: terdeteksi kata "${moderation.flaggedWords.join(', ')}". Mohon gunakan bahasa yang sopan.`
      );
    }

    const inserted = await db
      .insert(posts)
      .values({
        authorId,
        content,
        category: category || 'Teknologi',
        tags: tags || [],
        mediaUrl: mediaUrl || null,
        likesCount: 0,
        commentsCount: 0,
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// 5. Toggle Like
export async function togglePostLike(postId: string, userId: string) {
  try {
    const existing = await db
      .select()
      .from(likes)
      .where(sql`${likes.postId} = ${postId} AND ${likes.userId} = ${userId}`);

    if (existing.length > 0) {
      // Unlike
      await db
        .delete(likes)
        .where(sql`${likes.postId} = ${postId} AND ${likes.userId} = ${userId}`);

      await db
        .update(posts)
        .set({
          likesCount: sql`GREATEST(0, ${posts.likesCount} - 1)`,
        })
        .where(eq(posts.id, postId));

      return { liked: false };
    } else {
      // Like
      await db.insert(likes).values({
        postId,
        userId,
      });

      await db
        .update(posts)
        .set({
          likesCount: sql`${posts.likesCount} + 1`,
        })
        .where(eq(posts.id, postId));

      return { liked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw new Error('Gagal memperbarui status like.', { cause: error });
  }
}

// 6. Add a comment with moderation verification
export async function addPostComment(postId: string, authorId: string, text: string) {
  try {
    // Moderation check
    const moderation = checkContentModeration(text);
    if (!moderation.isClean) {
      throw new Error(
        `Komentar ditolak oleh sistem moderasi otomatis: terdeteksi kata "${moderation.flaggedWords.join(', ')}". Mohon berkomentar secara santun.`
      );
    }

    const inserted = await db
      .insert(comments)
      .values({
        postId,
        authorId,
        text,
      })
      .returning();

    await db
      .update(posts)
      .set({
        commentsCount: sql`${posts.commentsCount} + 1`,
      })
      .where(eq(posts.id, postId));

    return inserted[0];
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

// 7. Delete a post (Author authorization check)
export async function deletePost(postId: string, userId: string) {
  try {
    const postRecord = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
    });

    if (!postRecord) {
      throw new Error('Postingan tidak ditemukan di database.');
    }

    if (postRecord.authorId !== userId) {
      throw new Error('Akses ditolak: Anda hanya dapat menghapus postingan milik Anda sendiri.');
    }

    await db.delete(posts).where(eq(posts.id, postId));
    return { success: true, message: 'Postingan berhasil dihapus secara permanen.' };
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}
