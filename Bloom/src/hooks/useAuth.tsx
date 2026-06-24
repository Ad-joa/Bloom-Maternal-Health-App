import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  lmpDate: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setProfileState: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { uid, ...docSnap.data() } as UserProfile;
      }
    } catch (error) {
      console.error('Error fetching user profile from Firestore:', error);
    }
    return null;
  };

  const refreshProfile = async () => {
    if (user) {
      const updatedProfile = await fetchProfile(user.uid);
      setProfile(updatedProfile);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      setLoading(true);
      setUser(currentUser);
      if (currentUser) {
        const userProfile = await fetchProfile(currentUser.uid);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user,
        profile,
        loading,
        setProfileState: setProfile,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

