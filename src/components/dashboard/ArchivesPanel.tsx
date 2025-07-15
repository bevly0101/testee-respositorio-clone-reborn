import React, { useState, useEffect } from 'react';
import { X, Calendar, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Archive, Transaction } from './types';

interface ArchivesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onViewArchive: (archive: Archive) => void;
}

const ArchivesPanel: React.FC<ArchivesPanelProps> = ({ 
  isOpen, 
  onClose,
  onViewArchive
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [archives, setArchives] = useState<Archive[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArchives = async () => {
      if (user?.id && isOpen) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('archived_periods')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Erro ao buscar arquivos:', error);
            toast({
              title: "Erro",
              description: "Não foi possível carregar os arquivos.",
              variant: "destructive"
            });
            return;
          }

          // Transformar os dados para o tipo Archive correto
          const transformedArchives: Archive[] = (data || []).map(item => ({
            id: item.id,
            user_id: item.user_id,
            period_type: item.period_type,
            period_start: item.period_start,
            period_end: item.period_end,
            total_income: item.total_income,
            total_expenses: item.total_expenses,
            total_balance: item.total_balance,
            transactions_data: Array.isArray(item.transactions_data) 
              ? (item.transactions_data as unknown as Transaction[])
              : [],
            created_at: item.created_at
          }));

          setArchives(transformedArchives);
        } catch (error) {
          console.error('Erro ao buscar arquivos:', error);
          toast({
            title: "Erro",
            description: "Ocorreu um erro inesperado.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchArchives();
  }, [user, isOpen, toast]);

  const formatPeriod = (periodType: string, start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    };

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getPeriodLabel = (periodType: string) => {
    switch (periodType) {
      case 'semanal': return 'Semana';
      case 'mensal': return 'Mês';
      case 'trimestral': return 'Trimestre';
      default: return 'Período';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Períodos Arquivados
            </CardTitle>
            <CardDescription>Visualize seus dados de períodos anteriores</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando arquivos...</p>
            </div>
          ) : archives.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum período arquivado encontrado.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {archives.map((archive) => (
                <Card key={archive.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-blue-600">
                          {getPeriodLabel(archive.period_type)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatPeriod(archive.period_type, archive.period_start, archive.period_end)}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Entradas</p>
                          <p className="font-medium text-green-600">
                            R$ {archive.total_income.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Saídas</p>
                          <p className="font-medium text-red-600">
                            R$ {archive.total_expenses.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Saldo</p>
                          <p className={`font-medium ${archive.total_balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            R$ {archive.total_balance.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewArchive(archive)}
                    >
                      Visualizar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ArchivesPanel;
