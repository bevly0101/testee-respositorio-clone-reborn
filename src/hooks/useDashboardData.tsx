
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Transaction, Category, MonthlyData, Archive } from '@/components/dashboard/types';

export const useDashboardData = (especificarTipo: boolean, viewingArchive: Archive | null) => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { name: 'Alimentação', color: '#8B5CF6' }, 
    { name: 'Moradia', color: '#F97316' }, 
    { name: 'Transporte', color: '#0EA5E9' }, 
    { name: 'Saúde', color: '#1EAEDB' }, 
    { name: 'Educação', color: '#9b87f5' }, 
    { name: 'Lazer', color: '#7E69AB' },
    { name: 'Utilidades', color: '#D946EF' }
  ]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([
    { name: 'Jan', expenses: 0, income: 0 },
    { name: 'Fev', expenses: 0, income: 0 },
    { name: 'Mar', expenses: 0, income: 0 },
    { name: 'Abr', expenses: 0, income: 0 },
    { name: 'Mai', expenses: 0, income: 0 },
  ]);

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  const calculateMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentYear = new Date().getFullYear();
    
    return months.slice(0, 5).map(month => {
      const monthIndex = months.indexOf(month);
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date.split('/').reverse().join('-'));
        return transactionDate.getMonth() === monthIndex && transactionDate.getFullYear() === currentYear;
      });

      const income = monthTransactions
        .filter(t => t.type === 'entrada')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'saída')
        .reduce((sum, t) => sum + t.amount, 0);

      return { name: month, expenses, income };
    });
  };

  const fetchData = async () => {
    if (user && user.id) {
      setDataLoading(true);
      console.log(`Dashboard: Preparando para buscar dados para o usuário ${user.id}`);
      
      try {
        // Se estamos visualizando um arquivo, usar os dados do arquivo
        if (viewingArchive) {
          const archiveTransactions = viewingArchive.transactions_data || [];
          setTransactions(archiveTransactions);
          setTotalIncome(viewingArchive.total_income);
          setTotalExpenses(viewingArchive.total_expenses);
          setTotalBalance(viewingArchive.total_balance);
          
          const monthlyDataCalculated = calculateMonthlyData(archiveTransactions);
          setMonthlyData(monthlyDataCalculated);
          setDataLoading(false);
          return;
        }

        // Buscar dados das entradas
        const { data: entradasData, error: entradasError } = await supabase
          .from('entradas')
          .select('*')
          .eq('user_id', user.id);

        // Buscar dados dos gastos
        const { data: gastosData, error: gastosError } = await supabase
          .from('gastos')
          .select('*')
          .eq('user_id', user.id);
        
        if (entradasError || gastosError) {
          console.error('Erro ao buscar dados:', entradasError || gastosError);
          toast({ 
            title: "Erro ao buscar dados", 
            description: entradasError?.message || gastosError?.message, 
            variant: "destructive" 
          });
          setDataLoading(false);
          return;
        }

        console.log('Entradas encontradas:', entradasData);
        console.log('Gastos encontrados:', gastosData);

        // Combinar transações das duas tabelas
        const combinedTransactions: Transaction[] = [
          ...(entradasData || []).map(e => ({ 
            id: String(e.id), 
            user_id: e.user_id, 
            type: 'entrada' as const, 
            description: e.nome, 
            amount: Number(e.valor),
            date: new Date(e.created_at).toLocaleDateString(), 
            category: especificarTipo ? (e.tipo_especificado || e.tipo || 'Sem categoria') : (e.tipo || 'Sem categoria'),
            specificType: e.tipo_especificado
          })),
          ...(gastosData || []).map(g => ({ 
            id: String(g.id), 
            user_id: g.user_id, 
            type: 'saída' as const, 
            description: g.nome, 
            amount: Number(g.valor),
            date: new Date(g.created_at).toLocaleDateString(), 
            category: especificarTipo ? (g.tipo_especificado || g.tipo || 'Sem categoria') : (g.tipo || 'Sem categoria'),
            specificType: g.tipo_especificado
          }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setTransactions(combinedTransactions);

        // Calcular dados mensais
        const monthlyDataCalculated = calculateMonthlyData(combinedTransactions);
        setMonthlyData(monthlyDataCalculated);

      } catch (error) {
        console.error("Erro ao buscar dados do Supabase:", error);
        toast({ 
          title: "Erro ao buscar dados", 
          description: "Ocorreu um problema ao carregar suas informações.", 
          variant: "destructive" 
        });
      } finally {
        setDataLoading(false);
      }
    } else if (!authLoading && !user) {
      setTransactions([]);
      setMonthlyData([
        { name: 'Jan', expenses: 0, income: 0 },
        { name: 'Fev', expenses: 0, income: 0 },
        { name: 'Mar', expenses: 0, income: 0 },
        { name: 'Abr', expenses: 0, income: 0 },
        { name: 'Mai', expenses: 0, income: 0 }
      ]);
      setDataLoading(false);
      console.log("Dashboard: Usuário não logado ou auth ainda carregando, dados zerados.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, authLoading, toast, especificarTipo, viewingArchive]);

  useEffect(() => {
    if (transactions.length > 0) {
      const income = transactions
        .filter(t => t.type === 'entrada')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type === 'saída')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      setTotalIncome(income);
      setTotalExpenses(expenses);
      setTotalBalance(income - expenses);
    } else {
      setTotalIncome(0);
      setTotalExpenses(0);
      setTotalBalance(0);
    }
  }, [transactions]);

  return {
    transactions,
    categories,
    monthlyData,
    totalBalance,
    totalIncome,
    totalExpenses,
    dataLoading,
    fetchData
  };
};
