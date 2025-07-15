import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ChromeIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext'; // Importar useAuth

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading local para o submit do form
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, session } = useAuth(); // Pegar user e authLoading do contexto

  const from = location.state?.from?.pathname || "/dashboard";

  // Redireciona se o usuário já estiver logado
  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro de Login",
          description: error.message === "Invalid login credentials" ? "Email ou senha inválidos." : error.message,
          variant: "destructive",
        });
      } else if (data.user) {
        toast({
          title: "Login bem-sucedido!",
          description: "Redirecionando...",
        });
        // O onAuthStateChange no AuthContext vai lidar com a atualização do estado e
        // o useEffect acima (ou ProtectedRoute) cuidará do redirecionamento.
        // navigate(from, { replace: true }); // Removido, AuthContext cuida
      } else {
        // Este caso pode não ser necessário com o novo fluxo
        toast({
          title: "Erro de Login",
          description: "Ocorreu um erro inesperado. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Erro inesperado no login:", err);
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // redirectTo é importante para o fluxo OAuth.
          // O AuthProvider e ProtectedRoute cuidarão do redirecionamento final.
          redirectTo: `${window.location.origin}/dashboard` 
        }
      });
      if (error) {
        toast({
          title: "Erro com Login Google",
          description: error.message,
          variant: "destructive",
        });
        setLoading(false);
      }
      // A navegação é tratada pelo Supabase e pelo AuthContext.
    } catch (err) {
      console.error("Erro inesperado no login com Google:", err);
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro ao tentar login com Google.",
        variant: "destructive",
      });
      setLoading(false);
    }
    // Não resetar setLoading(false) aqui imediatamente se o redirecionamento OAuth iniciar,
    // pois a página pode mudar. Mas é bom ter para erros.
  };

  const goToHome = () => {
    navigate('/');
  };

  // Se authLoading, mostrar um loader simples ou nada para evitar piscar
  if (authLoading && !user) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-autofinance-gray-light">
        <p>Verificando autenticação...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col bg-autofinance-gray-light">
      <div className="p-4">
        <button onClick={goToHome} className="flex items-center text-gray-600 hover:text-autofinance-blue" disabled={loading}>
          <ArrowLeft className="mr-1" size={20} />
          <span>Voltar</span>
        </button>
      </div>
      
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <img alt="AutoFinance Logo" src="/lovable-uploads/d26be550-b458-42d4-82c9-9cc2a23b1720.png" className="h-10 w-auto mx-auto object-fill" />
            </Link>
            <h1 className="text-2xl font-bold mt-2">Entrar na sua conta</h1>
            <p className="text-gray-500 mt-2">Gerencie suas finanças pessoais de forma inteligente</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
                disabled={loading || authLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                required
                disabled={loading || authLoading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox id="remember" disabled={loading || authLoading} />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Lembrar de mim</label>
              </div>
              <a href="#" className="text-sm text-autofinance-blue hover:underline">Esqueceu a senha?</a>
            </div>
            
            <Button type="submit" className="w-full bg-autofinance-blue hover:bg-autofinance-blue-dark" disabled={loading || authLoading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleLogin}
              disabled={loading || authLoading}
            >
              <ChromeIcon className="mr-2 h-4 w-4" />
              {loading ? 'Aguarde...' : 'Entrar com Google'}
            </Button>
            
            <div className="text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-autofinance-blue hover:underline">
                Iniciar plano gratuito
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
