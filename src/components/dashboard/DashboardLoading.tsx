
import React from 'react';
import { UserCircle } from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';

const DashboardLoading: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <UserCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-pulse" />
          <p className="text-xl text-gray-500">Carregando dados do painel...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLoading;
