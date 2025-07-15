
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User, Subscription } from '@supabase/supabase-js'; // Importar Subscription
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true); // Iniciar carregamento
      try {
        const { data: { session: activeSession } } = await supabase.auth.getSession();
        setSession(activeSession);
        setUser(activeSession?.user ?? null);
      } catch (error) {
        console.error("Erro ao buscar sessão inicial:", error);
        // Tratar erro, talvez definindo session/user como null
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false); // Finalizar carregamento em todos os casos
      }
    };

    getSession();

    // Corrigido conforme sua sugestão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log("Auth state changed:", _event, newSession);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false); // Certificar que loading é false após mudança de estado

      if (_event === 'SIGNED_OUT') {
        navigate('/'); 
      }
      // Não é necessário redirecionar para /dashboard em SIGNED_IN aqui,
      // ProtectedRoute cuidará disso.
    });

    return () => {
      subscription?.unsubscribe(); // Correto
    };
  }, [navigate]);

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
      // Idealmente, mostrar um toast de erro aqui
      // Ex: toast({ title: "Erro ao sair", description: error.message, variant: "destructive" });
    }
    // O onAuthStateChange já cuidará de atualizar session e user para null
    // e o listener do useEffect cuidará do redirecionamento.
    // Não é necessário setar session/user para null aqui manualmente.
    setLoading(false); // Pode ser redundante se onAuthStateChange já define, mas seguro.
  };
  

  const value = {
    session,
    user,
    loading,
    logout,
  };

  // Renderiza children apenas quando o carregamento inicial da sessão estiver concluído
  // para evitar piscar de conteúdo protegido.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
