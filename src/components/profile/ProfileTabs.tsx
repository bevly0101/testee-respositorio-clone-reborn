
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import ProfileTabContent from '../dashboard/tabs/ProfileTabContent';
import HistoryTabContent from '../dashboard/tabs/HistoryTabContent';
import WhatsAppTabContent from '../dashboard/tabs/WhatsAppTabContent';
import ProfileSettingsTabContent from './ProfileSettingsTabContent';
import { Transaction, MonthlyData, ToastFunction } from '../dashboard/types';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  transactions: Transaction[];
  monthlyData: MonthlyData[];
  whatsappNumber: string;
  setWhatsappNumber: (value: string) => void;
  handleAddTransaction: () => void;
  handleConnectWhatsApp: () => void;
  toast: ToastFunction;
  especificarTipo: boolean;
  onEspecificarTipoChange: (value: boolean) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  setActiveTab,
  transactions,
  monthlyData,
  whatsappNumber,
  setWhatsappNumber,
  handleAddTransaction,
  handleConnectWhatsApp,
  toast,
  especificarTipo,
  onEspecificarTipoChange,
}) => {
  return (
    <Tabs value={activeTab} className="mb-8" onValueChange={setActiveTab}>
      <TabsList className="mb-4 grid w-full grid-cols-2 sm:grid-cols-4">
        <TabsTrigger value="profile">Perfil</TabsTrigger>
        <TabsTrigger value="history">Histórico</TabsTrigger>
        <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        <TabsTrigger value="settings">Configurações</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileTabContent />
      </TabsContent>
      
      <TabsContent value="history">
        <HistoryTabContent 
          monthlyData={monthlyData} 
          onAddTransaction={handleAddTransaction} 
        />
      </TabsContent>

      <TabsContent value="whatsapp">
        <WhatsAppTabContent 
          whatsappNumber={whatsappNumber}
          setWhatsappNumber={setWhatsappNumber}
          onConnectWhatsApp={handleConnectWhatsApp}
        />
      </TabsContent>
      
      <TabsContent value="settings">
        <ProfileSettingsTabContent 
          toast={toast}
          especificarTipo={especificarTipo}
          onEspecificarTipoChange={onEspecificarTipoChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
