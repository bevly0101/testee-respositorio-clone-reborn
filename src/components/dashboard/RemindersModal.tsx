
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";

interface Reminder {
  id: number;
  titulo: string;
  descricao?: string;
  data_vencimento: string;
  valor?: number;
  recorrente: boolean;
}

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RemindersModal: React.FC<RemindersModalProps> = ({ isOpen, onClose }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReminders = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lembretes_pagamento')
        .select('*')
        .eq('user_id', user.id)
        .order('data_vencimento', { ascending: true });

      if (error) {
        console.error('Erro ao buscar lembretes:', error);
        toast({
          title: "Erro ao carregar lembretes",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      setReminders(data || []);
    } catch (error) {
      console.error('Erro ao buscar lembretes:', error);
      toast({
        title: "Erro ao carregar lembretes",
        description: "Ocorreu um erro inesperado",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchReminders();
    }
  }, [isOpen, user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold">Meus Lembretes</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-autofinance-blue"></div>
            </div>
          ) : reminders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Nenhum lembrete encontrado</p>
              <p className="text-sm">Você ainda não criou nenhum lembrete de pagamento.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {reminder.titulo}
                      </h3>
                      {reminder.descricao && (
                        <p className="text-sm text-gray-600 mb-2">
                          {reminder.descricao}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Vencimento: {formatDate(reminder.data_vencimento)}</span>
                        </div>
                        {reminder.valor && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatCurrency(reminder.valor)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {reminder.recorrente && (
                      <div className="flex items-center justify-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Recorrente
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemindersModal;
