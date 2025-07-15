
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User, Save } from 'lucide-react';

const countryOptions = [
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+34', country: 'Espanha', flag: '🇪🇸' },
  { code: '+33', country: 'França', flag: '🇫🇷' },
];

interface UserProfile {
  nome: string;
  username: string;
  telefone_whatsapp: string;
  countryCode: string;
  phoneNumber: string;
  email_verificado?: boolean;
}

const ProfileTabContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    nome: '',
    username: '',
    telefone_whatsapp: '',
    countryCode: '+55',
    phoneNumber: '',
    email_verificado: false
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('users')
          .select('nome, username, telefone_whatsapp, email_verificado')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil:', error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar suas informações.",
            variant: "destructive"
          });
          return;
        }

        if (data) {
          // Separar código do país do número
          let countryCode = '+55';
          let phoneNumber = '';
          
          if (data.telefone_whatsapp) {
            // Verificar se o telefone tem código do país
            for (const option of countryOptions) {
              const codeWithoutPlus = option.code.replace('+', '');
              if (data.telefone_whatsapp.startsWith(codeWithoutPlus)) {
                countryCode = option.code;
                phoneNumber = data.telefone_whatsapp.substring(codeWithoutPlus.length);
                break;
              }
            }
            
            // Se não encontrou código conhecido, usar o valor completo como número
            if (!phoneNumber) {
              phoneNumber = data.telefone_whatsapp;
            }
          }

          setProfile({
            nome: data.nome || '',
            username: data.username || '',
            telefone_whatsapp: data.telefone_whatsapp || '',
            countryCode,
            phoneNumber,
            email_verificado: data.email_verificado || false
          });
        }
      } catch (error) {
        console.error('Erro inesperado ao buscar perfil:', error);
        toast({
          title: "Erro",
          description: "Erro inesperado ao carregar perfil.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado.",
        variant: "destructive"
      });
      return;
    }

    if (!profile.nome.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Nome é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    if (!profile.username.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Nome de usuário é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Formatar telefone: código do país + número (apenas dígitos)
      const cleanPhoneNumber = profile.phoneNumber.replace(/\D/g, '');
      const fullPhoneNumber = `${profile.countryCode.replace('+', '')}${cleanPhoneNumber}`;
      
      console.log('Salvando telefone formatado:', fullPhoneNumber);
      
      const { error } = await supabase
        .from('users')
        .update({
          nome: profile.nome.trim(),
          username: profile.username.trim(),
          telefone_whatsapp: fullPhoneNumber
        })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao salvar perfil:', error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar as alterações.",
          variant: "destructive"
        });
        return;
      }

      // Atualizar estado local
      setProfile(prev => ({
        ...prev,
        telefone_whatsapp: fullPhoneNumber
      }));

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
    } catch (error) {
      console.error('Erro inesperado ao salvar:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.id || !user?.email) return;

    try {
      const { data, error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email: user.email, 
          userId: user.id,
          nome: profile.nome 
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        toast({
          title: "Email Enviado",
          description: "Um novo email de verificação foi enviado.",
        });
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao enviar email.",
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <User className="w-8 h-8 mx-auto mb-4 text-gray-300 animate-pulse" />
            <p className="text-gray-500">Carregando informações do perfil...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Minha Conta
        </CardTitle>
        <CardDescription>
          Gerencie suas informações pessoais e configurações de conta.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-100 flex-1"
              />
              {profile.email_verificado ? (
                <span className="text-green-600 text-sm font-medium">✓ Verificado</span>
              ) : (
                <Button 
                  onClick={handleResendVerification}
                  variant="outline" 
                  size="sm"
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  Verificar
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {profile.email_verificado 
                ? 'Email verificado com sucesso.'
                : 'Email não verificado. Clique em "Verificar" para receber um link de verificação.'
              }
            </p>
          </div>

          <div>
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={profile.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div>
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              type="text"
              placeholder="Seu nome de usuário"
              value={profile.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              disabled={isSaving}
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone WhatsApp</Label>
            <div className="flex gap-2">
              <Select 
                value={profile.countryCode} 
                onValueChange={(value) => handleInputChange('countryCode', value)}
                disabled={isSaving}
              >
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
                id="telefone"
                type="tel"
                placeholder="99999-9999"
                value={profile.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                disabled={isSaving}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Formato salvo: {profile.countryCode.replace('+', '')}{profile.phoneNumber.replace(/\D/g, '')}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTabContent;
