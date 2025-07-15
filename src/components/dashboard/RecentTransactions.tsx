import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, Edit, Trash2 } from 'lucide-react';
import { Transaction } from './types';

interface RecentTransactionsProps {
  transactions: Transaction[];
  onFilterByDate: () => void;
  onAddTransaction: () => void;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions, 
  onFilterByDate, 
  onAddTransaction 
}) => {
  // Limitar a 10 transações mais recentes
  const recentTransactions = transactions.slice(0, 10);

  const getCategoryColor = (category: string | null) => {
    if (!category) return 'bg-gray-500';
    
    const colors: { [key: string]: string } = {
      'Mercado': 'bg-orange-500',
      'Transporte': 'bg-blue-500', 
      'Assinatura': 'bg-purple-500',
      'Diversão': 'bg-pink-500',
      'Comida': 'bg-yellow-500',
      'Educação': 'bg-green-500',
      'Salário': 'bg-emerald-500',
      'Freelance': 'bg-teal-500',
      'Vendas': 'bg-indigo-500',
    };
    
    return colors[category] || 'bg-gray-500';
  };

  return (
    <Card className="h-fit">
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-lg lg:text-xl">Últimas transações</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Verifique as últimas transações</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onFilterByDate} 
              className="h-8 text-xs"
            >
              <CalendarIcon className="mr-1 h-3 w-3" /> Filtrar
            </Button>
            <Button 
              size="sm" 
              onClick={onAddTransaction} 
              className="h-8 text-xs"
            >
              <Plus className="mr-1 h-3 w-3" /> Nova
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[700px] px-3 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[140px] text-xs">Descrição</TableHead>
                    <TableHead className="min-w-[80px] text-xs">Valor</TableHead>
                    <TableHead className="min-w-[100px] text-xs">Categoria</TableHead>
                    <TableHead className="min-w-[60px] text-xs">Tipo</TableHead>
                    <TableHead className="min-w-[60px] text-xs">Pago</TableHead>
                    <TableHead className="min-w-[80px] text-xs">Data</TableHead>
                    <TableHead className="min-w-[80px] text-xs">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map(transaction => (
                    <TableRow key={transaction.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs p-2">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="text-xs p-2">
                        <span className={`font-medium ${transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                          R$ {transaction.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="p-2">
                        {transaction.category ? (
                          <Badge 
                            variant="secondary" 
                            className={`text-white text-xs ${getCategoryColor(transaction.category)}`}
                          >
                            {transaction.category}
                          </Badge>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="p-2">
                        <Badge 
                          variant={transaction.type === 'entrada' ? 'default' : 'destructive'} 
                          className="text-xs"
                        >
                          {transaction.type === 'entrada' ? 'Receita' : 'Despesa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-2">
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-green-50 text-green-700 border-green-200"
                        >
                          Pago
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs p-2 text-gray-600">
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="p-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Edit className="h-3 w-3 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-4 text-sm">Você ainda não tem transações.</p>
            <Button onClick={onAddTransaction} size="sm" className="text-xs">
              <Plus className="mr-1 h-3 w-3" /> Adicionar primeira transação
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;