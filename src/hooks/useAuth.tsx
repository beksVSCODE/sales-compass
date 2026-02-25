import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { mockAuthClient, type AppRole } from '@/integrations/mockAuth';

interface Profile {
  id?: string;
  user_id: string;
  email: string;
  full_name: string | null;
  region: string | null;
  category: string | null;
}

interface MockUser {
  id: string;
  email: string;
  full_name: string;
  aud?: string;
  confirmed_at?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string | null;
  last_sign_in_at?: string;
  app_metadata?: Record<string, any>;
  user_metadata?: Record<string, any>;
  identities?: any[];
  created_at?: string;
  updated_at?: string;
}

interface MockSession {
  user: MockUser;
}

interface AuthContextType {
  user: MockUser | null;
  session: MockSession | null;
  profile: Profile | null;
  role: AppRole | null;
  loading: boolean;
  isAdmin: boolean;
  isCeo: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<MockSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = (userId: string) => {
    const mockProfile = mockAuthClient.getCurrentProfile();
    const mockRole = mockAuthClient.getCurrentRole();

    if (mockProfile) {
      setProfile({
        id: userId,
        ...mockProfile,
      } as Profile);
    }
    if (mockRole) {
      setRole(mockRole);
    }
  };

  useEffect(() => {
    const { data } = mockAuthClient.onAuthStateChange((_event: string, session: any) => {
      if (session?.user) {
        const mockUser: MockUser = {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.full_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setSession(session);
        setUser(mockUser);
        fetchUserData(session.user.id);
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    const { data: sessionData } = mockAuthClient.getSession();
    if (sessionData?.session?.user) {
      const mockUser: MockUser = {
        id: sessionData.session.user.id,
        email: sessionData.session.user.email,
        full_name: sessionData.session.user.full_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setSession(sessionData.session);
      setUser(mockUser);
      fetchUserData(sessionData.session.user.id);
    }
    setLoading(false);

    return () => {
      // Cleanup
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await mockAuthClient.signInWithPassword(email, password);
    if (!error) {
      const { data } = mockAuthClient.getSession();
      if (data?.session?.user) {
        const mockUser: MockUser = {
          id: data.session.user.id,
          email: data.session.user.email,
          full_name: data.session.user.full_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setSession(data.session);
        setUser(mockUser);
        fetchUserData(data.session.user.id);
      }
    }
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await mockAuthClient.signUp(email, password, {
      data: { full_name: fullName },
    });
    if (!error) {
      const { data } = mockAuthClient.getSession();
      if (data?.session?.user) {
        const mockUser: MockUser = {
          id: data.session.user.id,
          email: data.session.user.email,
          full_name: data.session.user.full_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setSession(data.session);
        setUser(mockUser);
        fetchUserData(data.session.user.id);
      }
    }
    return { error };
  };

  const signOut = async () => {
    await mockAuthClient.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user, session, profile, role, loading,
        isAdmin: role === 'admin',
        isCeo: role === 'ceo',
        signIn, signUp, signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
