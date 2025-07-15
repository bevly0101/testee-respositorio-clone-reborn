
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

const DashboardUnauthorized: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <p className="text-xl text-gray-500">Você precisa estar logado para ver o painel.</p>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardUnauthorized;
