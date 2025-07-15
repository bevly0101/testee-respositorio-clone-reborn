
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart as RechartsPieChart, Pie, Cell, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon, BarChart as BarChartIcon, Plus } from 'lucide-react';
import { Category, MonthlyData } from './types';

interface ChartsSectionProps {
  expenseCategoriesData: { name: string, value: number }[];
  allCategories: Category[];
  monthlyChartData: MonthlyData[];
  onAddTransaction: () => void;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ expenseCategoriesData, allCategories, monthlyChartData, onAddTransaction }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card>
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-base sm:text-lg">Gastos por Categoria</CardTitle>
          <CardDescription className="text-sm">Distribuição de despesas por categoria</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="h-48 sm:h-56 lg:h-64 w-full">
            {expenseCategoriesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={expenseCategoriesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius="70%"
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    fontSize={12}
                  >
                    {expenseCategoriesData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={allCategories.find(c => c.name === entry.name)?.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <PieChartIcon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Sem dados de gastos para exibir.</p>
                  <Button onClick={onAddTransaction} variant="outline" size="sm" className="mt-2 h-8 text-xs">
                    <Plus className="mr-1 h-3 w-3" /> Adicionar transação
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-base sm:text-lg">Receitas x Despesas</CardTitle>
          <CardDescription className="text-sm">Comparação mensal de entradas e saídas</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="h-48 sm:h-56 lg:h-64 w-full">
            {monthlyChartData.some(d => d.income > 0 || d.expenses > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={monthlyChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                  <Legend fontSize={12} />
                  <Bar dataKey="income" name="Receita" fill="#8B5CF6" />
                  <Bar dataKey="expenses" name="Despesa" fill="#F97316" />
                </RechartsBarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <BarChartIcon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Sem dados históricos para exibir.</p>
                  <Button onClick={onAddTransaction} variant="outline" size="sm" className="mt-2 h-8 text-xs">
                    <Plus className="mr-1 h-3 w-3" /> Adicionar transação
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
