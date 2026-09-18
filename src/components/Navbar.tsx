import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Search, Sparkles, LogIn, LogOut, Database, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCreateModal: () => void;
  onOpenProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenCreateModal,
  onOpenProfileModal,
}) => {
  const { firebaseUser, dbUser, signInWithGoogle, signOut, loading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoggingIn(true);
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign in failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-neutral-900 tracking-tight text-lg">KreatorHub</span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Database className="w-2.5 h-2.5" />
                PostgreSQL
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 hidden sm:block">Full-Stack Cloud SQL Platform</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-posts-input"
              type="text"
              placeholder="Cari konten, penulis, atau tag..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all text-neutral-800 placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                id="clear-search-button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Actions & Real Auth */}
        <div className="flex items-center gap-3">
          <button
            id="create-post-navbar-btn"
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Buat Konten</span>
            <span className="sm:hidden">Posting</span>
          </button>

          {/* User Sign In / Profile status */}
          {loading ? (
            <div className="h-9 w-24 bg-neutral-100 rounded-lg animate-pulse" />
          ) : firebaseUser ? (
            <div className="flex items-center gap-2">
              <button
                id="user-profile-btn"
                onClick={onOpenProfileModal}
                title="Buka Profil Saya"
                className="flex items-center gap-2 p-1.5 pl-2 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300 transition text-left cursor-pointer group"
              >
                <img
                  src={firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={firebaseUser.displayName || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-neutral-200 group-hover:ring-2 ring-neutral-400/40 transition"
                />
                <div className="hidden lg:block text-left pr-1">
                  <p className="text-xs font-semibold text-neutral-900 leading-tight max-w-[110px] truncate">
                    {firebaseUser.displayName || dbUser?.name || 'Kreator'}
                  </p>
                  <p className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Profil Saya
                  </p>
                </div>
              </button>
              <button
                id="sign-out-btn"
                onClick={signOut}
                title="Keluar akun"
                className="p-2 text-neutral-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-neutral-200 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="google-signin-btn"
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="flex items-center gap-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs font-semibold px-3 py-2 rounded-lg transition shadow-xs disabled:opacity-60 active:scale-[0.98]"
            >
              <LogIn className="w-3.5 h-3.5 text-neutral-600" />
              <span>{isLoggingIn ? 'Memproses...' : 'Masuk Google'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="search-posts-mobile"
            type="text"
            placeholder="Cari postingan, topik, atau penulis..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 text-neutral-800"
          />
        </div>
      </div>
    </header>
  );
};
