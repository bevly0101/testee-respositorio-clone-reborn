
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from 'lucide-react';

interface StatsCardsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ totalBalance, totalIncome, totalExpenses }) => {
  const lastMonthBalance = totalBalance - (totalIncome - totalExpenses);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
      <Card className="min-h-[100px] bg-gradient-to-r from-gray-100 to-gray-50">
        <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-gray-500">Mês Anterior (Janeiro)</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700">R$ {lastMonthBalance.toFixed(2)}</div>
          <div className="text-xs text-gray-500 mt-1">1 De Jan. Até 31 De Jan.</div>
        </CardContent>
      </Card>
      
      <Card className="min-h-[100px] bg-gradient-to-r from-green-100 to-green-50">
        <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-green-600">Receitas</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="flex items-center">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700">R$ {totalIncome.toFixed(2)}</span>
          </div>
          <div className="text-xs text-green-600 mt-1">1 De Fev. Até 28 De Fev.</div>
        </CardContent>
      </Card>
      
      <Card className="min-h-[100px] bg-gradient-to-r from-red-100 to-red-50">
        <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-red-600">Despesas</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="flex items-center">
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-red-700">R$ {totalExpenses.toFixed(2)}</span>
          </div>
          <div className="text-xs text-red-600 mt-1">1 De Fev. Até 28 De Fev.</div>
        </CardContent>
      </Card>

      <Card className="min-h-[100px] bg-gradient-to-r from-blue-100 to-blue-50">
        <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium text-blue-600">Saldo Atual (Fevereiro)</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className={`text-lg sm:text-xl lg:text-2xl font-bold ${totalBalance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            R$ {totalBalance >= 0 ? '' : '-'}{Math.abs(totalBalance).toFixed(2)}
          </div>
          <div className="text-xs text-blue-600 mt-1">1 De Fev. Até 28 De Fev.</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
