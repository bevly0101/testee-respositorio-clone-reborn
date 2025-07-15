
import React from 'react';

interface DashboardHeaderProps {
  userEmail: string | null | undefined;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userEmail }) => {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Painel de Controle</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Bem-vindo(a) de volta, {userEmail?.split('@')[0] || 'Usuário'}!
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
