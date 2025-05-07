export interface User {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export interface AuthStoreState extends AuthState {
  sessionToken: string | null;
}
