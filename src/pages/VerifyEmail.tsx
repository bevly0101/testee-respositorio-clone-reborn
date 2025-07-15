
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [countdown, setCountdown] = useState(3);

  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token || !userId) {
        setVerificationState('error');
        setMessage('Link de verificação inválido. Parâmetros ausentes.');
        return;
      }

      try {
        console.log('Verificando email com token:', token, 'userId:', userId);

        const { data, error } = await supabase.functions.invoke('verify-email', {
          body: { token, userId }
        });

        console.log('Resposta da verificação:', data, error);

        if (error) {
          throw error;
        }

        if (data.success) {
          setVerificationState('success');
          if (data.alreadyVerified) {
            setMessage('Seu email já foi verificado anteriormente!');
          } else {
            setMessage('Email verificado com sucesso! Redirecionando para o painel...');
          }
          
          if (data.user?.email) {
            setUserEmail(data.user.email);
          }

          toast({
            title: "Sucesso!",
            description: data.message,
          });

          // Iniciar countdown e redirecionamento automático
          const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                navigate('/dashboard');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

        } else {
          if (data.expired) {
            setVerificationState('expired');
            setMessage('O link de verificação expirou. Solicite um novo link.');
          } else {
            setVerificationState('error');
            setMessage(data.error || 'Erro ao verificar email.');
          }

          toast({
            title: "Erro na Verificação",
            description: data.error || 'Erro ao verificar email.',
            variant: "destructive"
          });
        }
      } catch (error: any) {
        console.error('Erro ao verificar email:', error);
        setVerificationState('error');
        setMessage('Erro interno. Tente novamente mais tarde.');
        
        toast({
          title: "Erro",
          description: "Erro interno. Tente novamente mais tarde.",
          variant: "destructive"
        });
      }
    };

    verifyEmail();
  }, [token, userId, toast, navigate]);

  const handleResendVerification = async () => {
    if (!userId) return;

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email, nome')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        toast({
          title: "Erro",
          description: "Não foi possível encontrar o usuário.",
          variant: "destructive"
        });
        return;
      }

      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email: userData.email, 
          userId: userId,
          nome: userData.nome 
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "Email Reenviado",
          description: "Um novo email de verificação foi enviado.",
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
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const renderIcon = () => {
    switch (verificationState) {
      case 'loading':
        return <RefreshCw className="w-16 h-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-500" />;
      case 'expired':
        return <Clock className="w-16 h-16 text-yellow-500" />;
      case 'error':
      default:
        return <XCircle className="w-16 h-16 text-red-500" />;
    }
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'loading':
        return (
          <>
            <CardTitle className="text-center text-xl">Verificando Email...</CardTitle>
            <CardDescription className="text-center">
              Aguarde enquanto verificamos seu email.
            </CardDescription>
          </>
        );
      case 'success':
        return (
          <>
            <CardTitle className="text-center text-xl text-green-600">Email Verificado!</CardTitle>
            <CardDescription className="text-center">
              {message}
              {userEmail && (
                <div className="mt-2 text-sm text-gray-600">
                  Email verificado: {userEmail}
                </div>
              )}
              <div className="mt-4 text-lg font-semibold text-blue-600">
                Redirecionando em {countdown} segundo{countdown !== 1 ? 's' : ''}...
              </div>
            </CardDescription>
          </>
        );
      case 'expired':
        return (
          <>
            <CardTitle className="text-center text-xl text-yellow-600">Link Expirado</CardTitle>
            <CardDescription className="text-center">
              {message}
            </CardDescription>
          </>
        );
      case 'error':
      default:
        return (
          <>
            <CardTitle className="text-center text-xl text-red-600">Erro na Verificação</CardTitle>
            <CardDescription className="text-center">
              {message}
            </CardDescription>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {renderIcon()}
          </div>
          {renderContent()}
        </CardHeader>
        <CardContent className="space-y-4">
          {verificationState === 'success' && (
            <div className="space-y-3">
              <Button 
                onClick={handleGoToDashboard}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Ir para o Painel Agora
              </Button>
              <Button 
                onClick={() => navigate('/login')}
                variant="outline" 
                className="w-full"
              >
                Fazer Login
              </Button>
            </div>
          )}

          {(verificationState === 'expired' || verificationState === 'error') && (
            <div className="space-y-3">
              {userId && (
                <Button 
                  onClick={handleResendVerification}
                  className="w-full"
                  variant="outline"
                >
                  Reenviar Email de Verificação
                </Button>
              )}
              <Button 
                onClick={() => navigate('/register')}
                variant="outline" 
                className="w-full"
              >
                Novo Cadastro
              </Button>
              <Button 
                onClick={() => navigate('/')}
                variant="outline" 
                className="w-full"
              >
                Voltar ao Início
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
