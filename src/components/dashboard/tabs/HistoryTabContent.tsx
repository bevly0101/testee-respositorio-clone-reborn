
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart as BarChartIcon, Plus } from 'lucide-react';
import { MonthlyData } from '../types';

interface HistoryTabContentProps {
  monthlyData: MonthlyData[];
  onAddTransaction: () => void;
}

const HistoryTabContent: React.FC<HistoryTabContentProps> = ({ monthlyData, onAddTransaction }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico Financeiro</CardTitle>
        <CardDescription>Acompanhe seu progresso financeiro ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent>
        {monthlyData.some(d => d.income > 0 || d.expenses > 0) ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={monthlyData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="income" name="Receita" fill="#8B5CF6" />
                <Bar dataKey="expenses" name="Despesa" fill="#F97316" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <BarChartIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="mb-4">Sem dados históricos para exibir.</p>
            <Button onClick={onAddTransaction}>
              <Plus className="mr-1 h-4 w-4" /> Adicionar primeira transação
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryTabContent;

