
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import TransactionsTabContent from './tabs/TransactionsTabContent';
import CategoriesTabContent from './tabs/CategoriesTabContent';
import { Transaction, Category, MonthlyData, ToastFunction } from './types';

interface MainTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  transactions: Transaction[];
  categories: Category[];
  monthlyData: MonthlyData[];
  whatsappNumber: string;
  setWhatsappNumber: (value: string) => void;
  handleFilterByDate: () => void;
  handleAddTransaction: () => void;
  handleConnectWhatsApp: () => void;
  toast: ToastFunction;
}

const MainTabs: React.FC<MainTabsProps> = ({
  activeTab,
  setActiveTab,
  transactions,
  categories,
  monthlyData,
  whatsappNumber,
  setWhatsappNumber,
  handleFilterByDate,
  handleAddTransaction,
  handleConnectWhatsApp,
  toast,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Verificar se há uma aba específica na URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['transactions', 'categories'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
      // Limpar o parâmetro da URL depois de definir a aba
      setSearchParams({});
    }
  }, [searchParams, setActiveTab, setSearchParams]);

  return (
    <Tabs defaultValue="transactions" value={activeTab} className="mb-8" onValueChange={setActiveTab}>
      <TabsList className="mb-4 grid w-full grid-cols-2">
        <TabsTrigger value="transactions" className="text-sm">Transações</TabsTrigger>
        <TabsTrigger value="categories" className="text-sm">Categorias</TabsTrigger>
      </TabsList>
      
      <TabsContent value="transactions">
        <TransactionsTabContent 
          transactions={transactions}
          onFilterByDate={handleFilterByDate}
          onAddTransaction={handleAddTransaction}
        />
      </TabsContent>
      
      <TabsContent value="categories">
        <CategoriesTabContent categories={categories} toast={toast} />
      </TabsContent>
    </Tabs>
  );
};

export default MainTabs;
