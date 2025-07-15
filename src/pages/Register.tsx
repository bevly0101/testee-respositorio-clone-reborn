
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  telefone_whatsapp: string;
  username: string;
  nome_completo: string;
  countryCode: string;
}

const countryOptions = [
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+34', country: 'Espanha', flag: '🇪🇸' },
  { code: '+33', country: 'França', flag: '🇫🇷' },
];

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    telefone_whatsapp: '',
    username: '',
    nome_completo: '',
    countryCode: '+55'
  });

  const validateForm = (): string | null => {
    if (!formData.email.trim()) {
      return 'Email é obrigatório';
    }
    
    if (!formData.email.includes('@')) {
      return 'Email deve ter um formato válido';
    }
    
    if (!formData.password.trim()) {
      return 'Senha é obrigatória';
    }
    
    if (formData.password.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      return 'Senhas não coincidem';
    }
    
    if (!formData.telefone_whatsapp.trim()) {
      return 'Telefone WhatsApp é obrigatório';
    }
    
    if (!formData.username.trim()) {
      return 'Nome de usuário é obrigatório';
    }
    
    if (!formData.nome_completo.trim()) {
      return 'Nome completo é obrigatório';
    }
    
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryCodeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      countryCode: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Erro de Validação",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Iniciando processo de registro...');
      
      // Formatar telefone com código do país (sem espaços ou caracteres especiais)
      const cleanPhoneNumber = formData.telefone_whatsapp.replace(/\D/g, '');
      const fullPhoneNumber = `${formData.countryCode.replace('+', '')}${cleanPhoneNumber}`;
      
      console.log('Dados do registro:', {
        email: formData.email,
        telefone_whatsapp: fullPhoneNumber,
        username: formData.username,
        nome_completo: formData.nome_completo
      });

      // Registrar usuário no Supabase Auth com dados simplificados
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            telefone_whatsapp: fullPhoneNumber,
            username: formData.username,
            nome_completo: formData.nome_completo,
          }
        }
      });

      if (error) {
        console.error('Erro no signup:', error);
        
        let errorMessage = 'Erro ao criar conta. Tente novamente.';
        
        if (error.message.includes('User already registered')) {
          errorMessage = 'Este email já está cadastrado. Tente fazer login ou use outro email.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Email inválido. Verifique o formato do email.';
        } else if (error.message.includes('Password')) {
          errorMessage = 'Senha muito fraca. Use pelo menos 6 caracteres.';
        } else if (error.message.includes('signup is disabled')) {
          errorMessage = 'Cadastro temporariamente desabilitado. Tente novamente mais tarde.';
        } else {
          errorMessage = `Erro no cadastro: ${error.message}`;
        }
        
        toast({
          title: "Erro no Cadastro",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      if (data.user) {
        console.log('Usuário criado no auth:', data.user);

        // Enviar email de verificação via Edge Function
        try {
          const { data: emailData, error: emailError } = await supabase.functions.invoke('send-verification-email', {
            body: { 
              email: formData.email, 
              userId: data.user.id,
              nome: formData.nome_completo 
            }
          });

          if (emailError) {
            console.error('Erro ao enviar email de verificação:', emailError);
            // Não bloquear o cadastro se o email falhar
          } else if (emailData?.success) {
            console.log('Email de verificação enviado com sucesso');
          }
        } catch (emailError) {
          console.error('Erro ao enviar email de verificação:', emailError);
          // Não bloquear o cadastro se o email falhar
        }

        // Chamar webhook de notificação manualmente se necessário
        try {
          await supabase.functions.invoke('user-registration-webhook', {
            body: {
              type: 'INSERT',
              table: 'users',
              record: {
                id: data.user.id,
                email: formData.email,
                telefone_whatsapp: fullPhoneNumber,
                nome: formData.nome_completo,
                username: formData.username
              },
              schema: 'public'
            }
          });
        } catch (webhookError) {
          console.error('Erro ao chamar webhook:', webhookError);
          // Não bloquear o cadastro se o webhook falhar
        }

        toast({
          title: "Conta Criada com Sucesso!",
          description: "Verifique seu email para confirmar a conta antes de fazer login.",
        });

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }

    } catch (error) {
      console.error('Erro inesperado no registro:', error);
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente em alguns minutos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Criar Conta</CardTitle>
          <CardDescription className="text-center">
            Preencha os dados para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome_completo">Nome Completo</Label>
              <Input
                id="nome_completo"
                name="nome_completo"
                type="text"
                placeholder="Seu nome completo"
                value={formData.nome_completo}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Seu nome de usuário"
                value={formData.username}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefone_whatsapp">Telefone WhatsApp</Label>
              <div className="flex gap-2">
                <Select value={formData.countryCode} onValueChange={handleCountryCodeChange} disabled={isLoading}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((option) => (
                      <SelectItem key={option.code} value={option.code}>
                        {option.flag} {option.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="telefone_whatsapp"
                  name="telefone_whatsapp"
                  type="tel"
                  placeholder="99999-9999"
                  value={formData.telefone_whatsapp}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="flex-1"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Formato final: {formData.countryCode.replace('+', '')}{formData.telefone_whatsapp.replace(/\D/g, '')}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Sua senha"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirme sua senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link 
              to="/login" 
              className="text-blue-600 hover:underline"
            >
              Fazer Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
