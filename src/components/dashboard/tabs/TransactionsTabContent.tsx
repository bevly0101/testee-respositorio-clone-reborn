
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
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsTabContentProps {
  transactions: Transaction[];
  onFilterByDate: () => void;
  onAddTransaction: () => void;
}

const TransactionsTabContent: React.FC<TransactionsTabContentProps> = ({ 
  transactions, 
  onFilterByDate, 
  onAddTransaction 
}) => {
  return (
    <Card>
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-base sm:text-lg lg:text-xl">Transações Recentes</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Visualize todas as suas transações recentes</CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end mb-4 sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onFilterByDate} 
            className="w-full sm:w-auto h-8 sm:h-9 text-xs sm:text-sm"
          >
            <CalendarIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Filtrar por data
          </Button>
          <Button 
            size="sm" 
            onClick={onAddTransaction} 
            className="w-full sm:w-auto h-8 sm:h-9 text-xs sm:text-sm"
          >
            <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Nova transação
          </Button>
        </div>
        
        {transactions.length > 0 ? (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[500px] px-3 sm:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Descrição</TableHead>
                    <TableHead className="min-w-[70px] text-xs sm:text-sm">Data</TableHead>
                    <TableHead className="min-w-[90px] text-xs sm:text-sm">Categoria</TableHead>
                    <TableHead className="min-w-[80px] text-xs sm:text-sm">Valor</TableHead>
                    <TableHead className="min-w-[60px] text-xs sm:text-sm">Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4">
                        {transaction.description}
                      </TableCell>
                      <TableCell className="text-xs p-2 sm:p-4">
                        {transaction.date}
                      </TableCell>
                      <TableCell className="p-2 sm:p-4">
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm">{transaction.category || '-'}</span>
                          {transaction.specificType && (
                            <span className="text-xs text-gray-500">({transaction.specificType})</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4">
                        R$ {transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="p-2 sm:p-4">
                        <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-10 text-gray-500">
            <p className="mb-4 text-xs sm:text-sm lg:text-base">Você ainda não tem transações.</p>
            <Button onClick={onAddTransaction} className="h-8 sm:h-9 text-xs sm:text-sm">
              <Plus className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Adicionar primeira transação
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionsTabContent;
