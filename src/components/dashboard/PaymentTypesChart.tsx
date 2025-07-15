import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CreditCard } from 'lucide-react';
import { Transaction } from './types';

interface PaymentTypesChartProps {
  transactions: Transaction[];
}

const PaymentTypesChart: React.FC<PaymentTypesChartProps> = ({ transactions }) => {
  const getCurrentMonthName = () => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[new Date().getMonth()];
  };

  const paymentTypesData = transactions
    .filter(t => t.type === 'saída' && t.specificType)
    .reduce((acc, transaction) => {
      const paymentType = transaction.specificType || 'Outros';
      const existingType = acc.find(type => type.name === paymentType);
      if (existingType) {
        existingType.value += transaction.amount;
      } else {
        acc.push({ name: paymentType, value: transaction.amount });
      }
      return acc;
    }, [] as { name: string, value: number }[]);

  const colors = [
    'hsl(var(--chart-primary))',     // #1DBC77
    'hsl(var(--chart-secondary))',   // #0F2A49  
    'hsl(var(--chart-accent))',      // Variante do verde
    'hsl(var(--chart-variant))'      // Variante do azul
  ];

  return (
    <Card className="h-fit">
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-base sm:text-lg">Tipos de Pagamento</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Métodos de pagamento utilizados<br />
          1 De {getCurrentMonthName()} - 28 De {getCurrentMonthName()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="h-64 sm:h-80 w-full">
          {paymentTypesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={paymentTypesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  fontSize={11}
                >
                  {paymentTypesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sem dados de pagamento para exibir.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Adicione transações para ver o gráfico
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTypesChart;