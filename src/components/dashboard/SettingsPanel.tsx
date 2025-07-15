
import React, { useState, useEffect } from 'react';
import { X, Archive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  especificarTipo: boolean;
  onEspecificarTipoChange: (value: boolean) => void;
  onShowArchives: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, 
  onClose, 
  especificarTipo, 
  onEspecificarTipoChange,
  onShowArchives
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [resetOption, setResetOption] = useState<string>('sem-reset');

  // Buscar configuração de reset do usuário
  useEffect(() => {
    const fetchResetSettings = async () => {
      if (user?.id) {
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('reset_option')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Erro ao buscar configurações de reset:', error);
            return;
          }

          setResetOption(userData?.reset_option || 'sem-reset');
        } catch (error) {
          console.error('Erro ao buscar configurações de reset:', error);
        }
      }
    };

    if (isOpen) {
      fetchResetSettings();
    }
  }, [user, isOpen]);

  const handleEspecificarTipoChange = async (checked: boolean) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({ especificar_tipo: checked })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar configuração:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a configuração.",
          variant: "destructive"
        });
        return;
      }

      onEspecificarTipoChange(checked);
      toast({
        title: "Configuração atualizada",
        description: checked 
          ? "Agora os gráficos mostrarão tipos específicos." 
          : "Agora os gráficos mostrarão tipos gerais."
      });
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetOptionChange = async (value: string) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({ reset_option: value })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar configuração de reset:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar a configuração de reset.",
          variant: "destructive"
        });
        return;
      }

      setResetOption(value);
      toast({
        title: "Configuração de reset atualizada",
        description: `Reset do painel configurado para: ${value === 'sem-reset' ? 'Sem reset' : value}`
      });
    } catch (error) {
      console.error('Erro ao atualizar configuração de reset:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>Personalize a exibição dos seus dados</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="especificar-tipo"
                checked={especificarTipo}
                onCheckedChange={handleEspecificarTipoChange}
                disabled={isLoading}
              />
              <label 
                htmlFor="especificar-tipo" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Especificar Tipo
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Quando ativado, os gráficos e relatórios mostrarão categorias mais específicas dos seus gastos.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Reset do Painel</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={onShowArchives}
              >
                <Archive className="h-4 w-4 mr-1" />
                Ver Arquivos
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Configure quando o painel deve ser resetado automaticamente, mantendo apenas o saldo atual.
            </p>
            
            <RadioGroup 
              value={resetOption} 
              onValueChange={handleResetOptionChange}
              disabled={isLoading}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sem-reset" id="sem-reset" />
                <Label htmlFor="sem-reset" className="text-sm">Sem reset</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="semanal" id="semanal" />
                <Label htmlFor="semanal" className="text-sm">Semanal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mensal" id="mensal" />
                <Label htmlFor="mensal" className="text-sm">Mensal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trimestral" id="trimestral" />
                <Label htmlFor="trimestral" className="text-sm">Trimestral</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPanel;
