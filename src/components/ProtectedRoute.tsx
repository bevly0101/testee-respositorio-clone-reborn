
import React, { ReactElement, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: ReactElement;
}

interface UserData {
  id: string;
  email: string;
  email_verificado: boolean;
  nome: string;
}

interface VerificationLogData {
  status: string;
  verificado_em: string | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);

  const fetchUserData = async () => {
    if (!user) {
      setUserDataLoading(false);
      return;
    }

    try {
      // Buscar dados do usuário
      const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('id, email, email_verificado, nome')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Erro ao buscar dados do usuário:', userError);
        setUserDataLoading(false);
        return;
      }

      setUserData(userInfo);

      // Verificar status na tabela email_verification_logs
      const { data: verificationLog, error: logError } = await supabase
        .from('email_verification_logs')
        .select('status, verificado_em')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (logError && logError.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Erro ao buscar log de verificação:', logError);
      }

      // Se existe um log de verificação, usar o status dele
      if (verificationLog) {
        setVerificationStatus(verificationLog.status);
        console.log('Status de verificação encontrado:', verificationLog.status);
      } else {
        // Se não existe log, considerar como pending se o email não foi verificado
        setVerificationStatus(userInfo.email_verificado ? 'verified' : 'pending');
        console.log('Nenhum log encontrado, status baseado em email_verificado:', userInfo.email_verificado);
      }

    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setUserDataLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Recarregar dados do usuário quando voltar para a página (após verificação)
  useEffect(() => {
    const handleFocus = () => {
      if (user && verificationStatus !== 'verified') {
        fetchUserData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, verificationStatus]);

  const handleResendEmail = async () => {
    if (!user || !userData) return;

    setResendingEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email: userData.email, 
          userId: user.id,
          nome: userData.nome 
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "Email Reenviado",
          description: "Um novo email de verificação foi enviado para sua caixa de entrada.",
        });
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao reenviar email.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Erro ao reenviar email:', error);
      toast({
        title: "Erro",
        description: "Erro ao reenviar email de verificação.",
        variant: "destructive"
      });
    } finally {
      setResendingEmail(false);
    }
  };

  const handleRefresh = () => {
    fetchUserData();
  };

  if (loading || userDataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Skeleton className="h-12 w-12 rounded-full mb-4" />
        <Skeleton className="h-4 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se o email foi verificado baseado no status do log
  if (verificationStatus !== 'verified') {
    const isExpired = verificationStatus === 'expired';
    const isPending = verificationStatus === 'pending';

    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="max-w-md w-full">
            <Alert className={`border-yellow-200 bg-yellow-50 ${isExpired ? 'border-red-200 bg-red-50' : ''}`}>
              <Mail className={`h-4 w-4 ${isExpired ? 'text-red-600' : 'text-yellow-600'}`} />
              <AlertDescription className={isExpired ? 'text-red-800' : 'text-yellow-800'}>
                <div className="space-y-4">
                  <h3 className="font-semibold">
                    {isExpired ? 'Link de Verificação Expirado' : 'Verificação de Email Necessária'}
                  </h3>
                  <p>
                    {isExpired 
                      ? 'Seu link de verificação expirou. Solicite um novo email de verificação para acessar o painel de controle.'
                      : 'Para acessar o painel de controle, você precisa verificar seu email. Verifique sua caixa de entrada e clique no link de verificação que enviamos para ' + (userData?.email || user.email) + '.'
                    }
                  </p>
                  <p className="text-sm">
                    Status atual: <span className="font-semibold">{verificationStatus}</span>
                  </p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleRefresh}
                    >
                      Já verifiquei - Verificar novamente
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full text-sm"
                      onClick={handleResendEmail}
                      disabled={resendingEmail}
                    >
                      {resendingEmail ? 'Reenviando...' : 'Reenviar email de verificação'}
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
