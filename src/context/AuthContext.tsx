import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

export interface DbUser {
  id: string;
  uid: string;
  name: string;
  handle: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
}

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  dbUser: DbUser | null;
  loading: boolean;
  token: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync with backend API to get or create user in PostgreSQL
  const syncUserWithBackend = async (fUser: FirebaseUser, idToken: string) => {
    try {
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: fUser.displayName || '',
          avatarUrl: fUser.photoURL || '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDbUser(data.user);
      }
    } catch (err) {
      console.error('Failed to sync user with PostgreSQL backend:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      if (fUser) {
        setFirebaseUser(fUser);
        try {
          const idToken = await fUser.getIdToken();
          setToken(idToken);
          await syncUserWithBackend(fUser, idToken);
        } catch (err) {
          console.error('Error getting auth token:', err);
        }
      } else {
        setFirebaseUser(null);
        setDbUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      await syncUserWithBackend(result.user, idToken);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setFirebaseUser(null);
      setDbUser(null);
      setToken(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshToken = async () => {
    if (firebaseUser) {
      const freshToken = await firebaseUser.getIdToken(true);
      setToken(freshToken);
      return freshToken;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        dbUser,
        loading,
        token,
        signInWithGoogle,
        signOut,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
