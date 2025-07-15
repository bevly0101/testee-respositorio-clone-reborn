
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Bell, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // Para date-fns v2 e v3 (a partir de v3.0.0-beta.2, antes era /locale/pt-BR)

interface Reminder {
  id: number;
  titulo: string;
  data_vencimento: string;
  valor?: number | null;
}

const fetchReminders = async (userId: string): Promise<Reminder[]> => {
  const { data, error } = await supabase
    .from('lembretes_pagamento')
    .select('id, titulo, data_vencimento, valor')
    .eq('user_id', userId)
    .order('data_vencimento', { ascending: true })
    .limit(10); // Limitar para não sobrecarregar a sidebar

  if (error) {
    console.error('Error fetching reminders:', error);
    throw new Error(error.message);
  }
  return data || [];
};

const ReminderList = () => {
  const { user } = useAuth();

  const { data: reminders, isLoading, error, isError } = useQuery<Reminder[], Error>({
    queryKey: ['reminders', user?.id],
    queryFn: () => {
      if (!user?.id) {
        // Retornar array vazio ou lançar erro se o usuário for obrigatório
        return Promise.resolve([]);
      }
      return fetchReminders(user.id);
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Carregando lembretes...
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="p-4 text-red-600 flex items-center text-sm">
        <AlertTriangle className="h-5 w-5 mr-2 shrink-0" />
        <span>Erro: {error.message.substring(0, 50)}...</span>
      </div>
    );
  }

  if (!reminders || reminders.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
        Nenhum lembrete ativo.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
      {reminders.map((reminder) => (
        <Card key={reminder.id} className="shadow-sm text-xs">
          <CardContent className="p-2">
            <p className="font-medium truncate">{reminder.titulo}</p>
            <p className="text-muted-foreground">
              Vence: {format(new Date(reminder.data_vencimento + 'T00:00:00'), 'dd/MM/yy', { locale: ptBR })}
            </p>
            {typeof reminder.valor === 'number' && (
              <p className="text-muted-foreground">
                Valor: R$ {reminder.valor.toFixed(2)}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReminderList;
