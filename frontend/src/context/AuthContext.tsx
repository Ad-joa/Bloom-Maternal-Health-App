import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  name: string;
  email: string;
  trimester?: number;
  due_date?: string;
  is_first_pregnancy?: boolean;
  medical_conditions?: string;
  age?: number;
  weight?: string;
  primary_goal?: string;
  dietary_preferences?: string;
  avatar?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  blood_group?: string;
  height?: string;
  last_period_date?: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@bloom_user');
        const storedToken = await AsyncStorage.getItem('@bloom_token');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error("Failed to load user from storage", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData: User, tokenData: string) => {
    try {
      await AsyncStorage.setItem('@bloom_user', JSON.stringify(userData));
      await AsyncStorage.setItem('@bloom_token', tokenData);
      setUser(userData);
      setToken(tokenData);
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Failed to save session", e);
    }
  };

  const updateUser = async (updatedData: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedData };
      setUser(newUser);
      await AsyncStorage.setItem('@bloom_user', JSON.stringify(newUser));
    }
  };
  
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('@bloom_user');
      await AsyncStorage.removeItem('@bloom_token');
      await AsyncStorage.removeItem('@app_biometrics_enabled');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error("Failed to remove user from storage", e);
    }
  };

  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, updateUser }}>
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
