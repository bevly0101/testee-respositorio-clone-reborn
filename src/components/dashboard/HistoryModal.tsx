
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Edit, Trash2, Plus } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Transaction {
  id: number;
  nome: string;
  valor: number;
  tipo: string;
  tipo_especificado: string | null;
  data_entrada?: string;
  data_gasto?: string;
  created_at: string;
  table_type: 'entradas' | 'gastos';
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({
    nome: '',
    valor: '',
    tipo: '',
    tipo_especificado: ''
  });

  const categoriesOptions = [
    'Mercado',
    'Transporte', 
    'Assinatura',
    'Diversão',
    'Comida',
    'Educação',
    'Salário',
    'Freelance',
    'Investimento',
    'Outros'
  ];

  const fetchTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [entriesResponse, expensesResponse] = await Promise.all([
        supabase
          .from('entradas')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('gastos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (entriesResponse.error) throw entriesResponse.error;
      if (expensesResponse.error) throw expensesResponse.error;

      const formattedEntries = (entriesResponse.data || []).map(entry => ({
        ...entry,
        table_type: 'entradas' as const
      }));

      const formattedExpenses = (expensesResponse.data || []).map(expense => ({
        ...expense,
        table_type: 'gastos' as const
      }));

      const allTransactions = [...formattedEntries, ...formattedExpenses]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setTransactions(allTransactions);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar histórico de transações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchTransactions();
    }
  }, [isOpen, user]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      nome: transaction.nome,
      valor: transaction.valor.toString(),
      tipo: transaction.tipo,
      tipo_especificado: transaction.tipo_especificado || ''
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTransaction || !user) return;

    try {
      const updateData = {
        nome: editForm.nome,
        valor: parseFloat(editForm.valor),
        tipo: editForm.tipo,
        tipo_especificado: editForm.tipo_especificado || null
      };

      const { error } = await supabase
        .from(editingTransaction.table_type)
        .update(updateData)
        .eq('id', editingTransaction.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Transação atualizada com sucesso!",
      });

      setEditingTransaction(null);
      fetchTransactions();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar transação.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (transaction: Transaction) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from(transaction.table_type)
        .delete()
        .eq('id', transaction.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Transação excluída com sucesso!",
      });

      fetchTransactions();
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir transação.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Transações</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p>Carregando transações...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma transação encontrada.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {transactions.map((transaction) => (
                  <Card key={`${transaction.table_type}-${transaction.id}`} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {transaction.nome}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.table_type === 'entradas' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.table_type === 'entradas' ? 'Entrada' : 'Saída'}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(transaction)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-600">Valor</p>
                          <p className="font-bold text-lg">
                            {formatCurrency(transaction.valor)}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Categoria</p>
                          <p>{transaction.tipo}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Tipo Específico</p>
                          <p>{transaction.tipo_especificado || 'Não especificado'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-600">Data</p>
                          <p>{formatDate(transaction.data_entrada || transaction.data_gasto || transaction.created_at)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {editingTransaction && (
          <Dialog open={!!editingTransaction} onOpenChange={() => setEditingTransaction(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Transação</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-nome">Nome</Label>
                  <Input
                    id="edit-nome"
                    value={editForm.nome}
                    onChange={(e) => setEditForm(prev => ({ ...prev, nome: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-valor">Valor</Label>
                  <Input
                    id="edit-valor"
                    type="number"
                    step="0.01"
                    value={editForm.valor}
                    onChange={(e) => setEditForm(prev => ({ ...prev, valor: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tipo">Categoria</Label>
                  <Select
                    value={editForm.tipo}
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, tipo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-tipo-especificado">Tipo Específico</Label>
                  <Input
                    id="edit-tipo-especificado"
                    value={editForm.tipo_especificado}
                    onChange={(e) => setEditForm(prev => ({ ...prev, tipo_especificado: e.target.value }))}
                    placeholder="Ex: Cartão de Crédito, PIX, Dinheiro..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditingTransaction(null)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    Salvar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
