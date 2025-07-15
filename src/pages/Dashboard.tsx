
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AdminPanel from '@/components/dashboard/AdminPanel';
import AddTransactionDialog from '@/components/dashboard/AddTransactionDialog';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import CategoryChart from '@/components/dashboard/CategoryChart';
import PaymentTypesChart from '@/components/dashboard/PaymentTypesChart';
import MainTabs from '@/components/dashboard/MainTabs';
import SettingsPanel from '@/components/dashboard/SettingsPanel';
import ArchivesPanel from '@/components/dashboard/ArchivesPanel';
import ArchiveViewAlert from '@/components/dashboard/ArchiveViewAlert';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import DashboardUnauthorized from '@/components/dashboard/DashboardUnauthorized';
import { Archive } from '@/components/dashboard/types';
import { useResponsive } from '@/hooks/useResponsive';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useDashboardHandlers } from '@/hooks/useDashboardHandlers';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isMobile, isDesktop } = useResponsive();
  const { especificarTipo, setEspecificarTipo } = useUserSettings();
  
  // Check if user is admin
  const isAdmin = user?.email === 'hills@gmail.com';
  
  const [activeTab, setActiveTab] = useState('transactions');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArchivesOpen, setIsArchivesOpen] = useState(false);
  const [viewingArchive, setViewingArchive] = useState<Archive | null>(null);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const {
    transactions,
    categories,
    monthlyData,
    totalBalance,
    totalIncome,
    totalExpenses,
    dataLoading,
    fetchData
  } = useDashboardData(especificarTipo, viewingArchive);

  const {
    handleAddTransaction,
    handleTransactionAdded,
    handleFilterByDate,
    handleConnectWhatsApp,
    handleViewArchive,
    handleExitArchiveView
  } = useDashboardHandlers(viewingArchive, setViewingArchive, user, fetchData);

  const expenseCategoriesChartData = transactions
    .filter(t => t.type === 'saída' && t.category)
    .reduce((acc, transaction) => {
      const existingCategory = acc.find(cat => cat.name === transaction.category);
      if (existingCategory) {
        existingCategory.value += transaction.amount;
      } else if (transaction.category) {
        acc.push({ name: transaction.category, value: transaction.amount });
      }
      return acc;
    }, [] as { name: string, value: number }[]);

  const onAddTransaction = async () => {
    const canAdd = await handleAddTransaction();
    if (canAdd) {
      setIsAddTransactionOpen(true);
    }
  };

  if (authLoading || dataLoading) {
    return <DashboardLoading />;
  }
  
  if (!user) {
    return <DashboardUnauthorized />;
  }

  // Only show admin panel for admin user
  if (isAdmin) {
    return (
      <SidebarProvider defaultOpen={isDesktop}>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar onSettingsClick={() => setIsSettingsOpen(true)} />
          <SidebarInset className="flex-1 flex flex-col overflow-y-auto">
            <Header />
            
            <main className="flex-grow container mx-auto px-2 sm:px-4 py-4 sm:py-8">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Painel de Administração</h1>
                <p className="text-sm sm:text-base text-gray-600">Bem-vindo ao painel administrativo, {user.email}</p>
              </div>
              
              <AdminPanel />
            </main>
            
            <Footer />
          </SidebarInset>
        </div>

        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          especificarTipo={especificarTipo}
          onEspecificarTipoChange={setEspecificarTipo}
          onShowArchives={() => {
            setIsSettingsOpen(false);
            setIsArchivesOpen(true);
          }}
        />

        <ArchivesPanel
          isOpen={isArchivesOpen}
          onClose={() => setIsArchivesOpen(false)}
          onViewArchive={handleViewArchive}
        />
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={isDesktop}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar onSettingsClick={() => setIsSettingsOpen(true)} />
        <SidebarInset className="flex-1 flex flex-col overflow-y-auto">
          <Header />
          
          <main className="flex-grow container mx-auto px-2 sm:px-4 py-4 sm:py-8">
            {viewingArchive && (
              <ArchiveViewAlert
                viewingArchive={viewingArchive}
                onExitArchiveView={handleExitArchiveView}
              />
            )}
            
            <DashboardHeader userEmail={user.email} />
            
            <StatsCards 
              totalBalance={totalBalance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
            />
            
            {/* Layout com gráficos lado a lado */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
              <div>
                <CategoryChart
                  expenseCategoriesData={expenseCategoriesChartData}
                  allCategories={categories}
                />
              </div>
              <div>
                <PaymentTypesChart
                  transactions={transactions}
                />
              </div>
            </div>
            
            <MainTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              transactions={transactions}
              categories={categories}
              monthlyData={monthlyData}
              whatsappNumber={whatsappNumber}
              setWhatsappNumber={setWhatsappNumber}
              handleFilterByDate={handleFilterByDate}
              handleAddTransaction={onAddTransaction}
              handleConnectWhatsApp={() => handleConnectWhatsApp(whatsappNumber)}
              toast={() => {}}
            />
          </main>
          
          <Footer />
        </SidebarInset>
      </div>

      <AddTransactionDialog
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        onTransactionAdded={handleTransactionAdded}
        toast={() => {}}
      />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        especificarTipo={especificarTipo}
        onEspecificarTipoChange={setEspecificarTipo}
        onShowArchives={() => {
          setIsSettingsOpen(false);
          setIsArchivesOpen(true);
        }}
      />

      <ArchivesPanel
        isOpen={isArchivesOpen}
        onClose={() => setIsArchivesOpen(false)}
        onViewArchive={handleViewArchive}
      />
    </SidebarProvider>
  );
};

export default Dashboard;
