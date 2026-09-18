import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, Database, ShieldCheck, Zap } from 'lucide-react';

export const RoadmapPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside className="bg-white border border-neutral-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-neutral-900 text-sm">
              Status Sistem: Cloud SQL (PostgreSQL) & Firebase Auth
            </h3>
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Instance aktif di region asia-southeast1 dengan Drizzle ORM
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition"
        >
          {isExpanded ? (
            <>
              Tutup <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Detail Teknis <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3.5 text-xs">
          {/* Architecture overview */}
          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200/80">
            <h4 className="font-bold text-neutral-900 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Arsitektur Produksi UGC
            </h4>
            <p className="text-neutral-600 leading-relaxed">
              Platform kini menggunakan arsitektur full-stack sejati:
              <br />• <strong>PostgreSQL (Cloud SQL)</strong>: Menyimpan tabel relasional terstruktur (<code>users</code>, <code>posts</code>, <code>comments</code>, <code>likes</code>).
              <br />• <strong>Drizzle ORM</strong>: Menjamin keandalan skema dan eksekusi query type-safe dengan connection pool <code>pg.Pool</code>.
              <br />• <strong>Firebase Auth</strong>: Menyediakan login aman Google OAuth client-side dan verifikasi ID Token di middleware server <code>verifyIdToken()</code>.
            </p>
          </div>

          {/* Database Tables */}
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900">Skema Tabel yang Terpasang di Database:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-white border border-neutral-200 rounded-lg">
                <span className="font-bold text-neutral-800">1. users</span>
                <p className="text-neutral-500 mt-0.5">id (uuid PK), uid (Firebase UID), email, name, handle, avatar_url, bio, timestamps.</p>
              </div>
              <div className="p-2.5 bg-white border border-neutral-200 rounded-lg">
                <span className="font-bold text-neutral-800">2. posts</span>
                <p className="text-neutral-500 mt-0.5">id (uuid PK), author_id (FK), content, media_url, category, tags[], likes_count, comments_count.</p>
              </div>
              <div className="p-2.5 bg-white border border-neutral-200 rounded-lg">
                <span className="font-bold text-neutral-800">3. comments</span>
                <p className="text-neutral-500 mt-0.5">id (uuid PK), post_id (FK), author_id (FK), text, timestamps.</p>
              </div>
              <div className="p-2.5 bg-white border border-neutral-200 rounded-lg">
                <span className="font-bold text-neutral-800">4. likes</span>
                <p className="text-neutral-500 mt-0.5">id (uuid PK), post_id (FK), user_id (FK), unique constraint (user_id + post_id).</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
