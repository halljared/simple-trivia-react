import { createContext, useContext } from 'react';
import { AuthState } from '../types/auth';

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
