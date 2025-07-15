
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ProfileForm from '@/components/profile/ProfileForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponsive';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { isDesktop } = useResponsive();

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-500">Carregando perfil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <p className="text-xl text-gray-500">Você precisa estar logado para ver o perfil.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={isDesktop}>
      <div className="flex min-h-screen w-full bg-background">
        <SidebarInset className="flex-1 flex flex-col overflow-y-auto">
          <Header />
          
          <main className="flex-grow container mx-auto px-4 py-4 sm:py-8 max-w-2xl">
            {/* Header da página */}
            <div className="flex items-center mb-6">
              <Link to="/dashboard" className="mr-3">
                <ArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-800" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Minha Conta</h1>
                <p className="text-sm text-gray-600">Gerencie seu perfil e configurações</p>
              </div>
            </div>

            {/* Formulário de perfil */}
            <ProfileForm />
          </main>
          
          <Footer />
        </SidebarInset>
        <AppSidebar />
      </div>
    </SidebarProvider>
  );
};

export default Profile;
