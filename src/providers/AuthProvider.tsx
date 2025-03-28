import { ReactNode } from 'react';
import { useAuthStore } from '../stores/userStore';
import { AuthContext } from '../contexts/AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useAuthStore();

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}
