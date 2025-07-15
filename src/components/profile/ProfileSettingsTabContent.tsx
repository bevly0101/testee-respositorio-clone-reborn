
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ToastFunction } from '../dashboard/types';

interface ProfileSettingsTabContentProps {
  toast: ToastFunction;
  especificarTipo: boolean;
  onEspecificarTipoChange: (value: boolean) => void;
}

const ProfileSettingsTabContent: React.FC<ProfileSettingsTabContentProps> = ({ 
  toast, 
  especificarTipo, 
  onEspecificarTipoChange 
}) => {
  const { user } = useAuth();

  const handleEspecificarTipoChange = async (checked: boolean) => {
    if (!user?.id) {
      toast({ 
        title: "Erro", 
        description: "Usuário não encontrado.", 
        variant: "destructive" 
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ especificar_tipo: checked })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar configuração:', error);
        toast({ 
          title: "Erro", 
          description: "Não foi possível salvar a configuração.", 
          variant: "destructive" 
        });
        return;
      }

      onEspecificarTipoChange(checked);
      toast({ 
        title: "Sucesso", 
        description: "Configuração atualizada com sucesso!" 
      });
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({ 
        title: "Erro", 
        description: "Erro inesperado ao salvar configuração.", 
        variant: "destructive" 
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
        <CardDescription>Gerencie suas preferências e configurações de conta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="space-y-0.5">
              <Label htmlFor="especificar-tipo">Especificar Tipo de Transação</Label>
              <p className="text-sm text-gray-500">
                Quando ativado, você poderá especificar um tipo personalizado para suas transações
              </p>
            </div>
            <Switch
              id="especificar-tipo"
              checked={especificarTipo}
              onCheckedChange={handleEspecificarTipoChange}
            />
          </div>

          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="text-sm font-medium">Notificações</h3>
              <p className="text-sm text-gray-500">Receba alertas sobre suas finanças</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Em breve!",
                  description: "As configurações de notificações estarão disponíveis em breve."
                });
              }}
            >Configurar</Button>
          </div>
          
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="text-sm font-medium">Categorias</h3>
              <p className="text-sm text-gray-500">Personalize suas categorias de gastos</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Em breve!",
                  description: "O gerenciamento de categorias estará disponível em breve."
                });
              }}
            >Gerenciar</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Integração bancária</h3>
              <p className="text-sm text-gray-500">Conecte suas contas bancárias</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Em breve!",
                  description: "A integração bancária estará disponível em breve."
                });
              }}
            >Conectar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettingsTabContent;
