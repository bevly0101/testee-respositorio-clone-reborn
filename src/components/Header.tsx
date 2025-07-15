
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "./ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Menu } from 'lucide-react';
import { useSidebar } from "@/components/ui/sidebar";
import { useResponsive } from '@/hooks/useResponsive';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isMobile } = useResponsive();
  
  // Check if we're on a page that has SidebarProvider (Dashboard or Profile)
  const hasSidebar = location.pathname === '/dashboard' || location.pathname === '/profile';
  
  // Only use useSidebar hook if we're on a page with sidebar
  let toggleSidebar = () => {};
  if (hasSidebar) {
    try {
      const { toggleSidebar: sidebarToggle } = useSidebar();
      toggleSidebar = sidebarToggle;
    } catch (error) {
      // Fallback if useSidebar fails
      console.log('Sidebar not available on this page');
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img 
            alt="AutoFinance Logo" 
            src="/lovable-uploads/d26be550-b458-42d4-82c9-9cc2a23b1720.png" 
            className="h-8 w-auto" 
          />
          <span className="font-bold text-lg text-autofinance-blue">
            Auto<span className="text-gray-800">Finance</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleProfileClick}
                className="hidden sm:flex"
              >
                <User className="h-4 w-4 mr-2" />
                Perfil
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hidden sm:flex"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
              
              {/* Botão do menu mobile - só aparece em páginas com sidebar */}
              {isMobile && hasSidebar && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSidebar}
                  className="bg-white border-gray-300 shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-4 w-4 text-gray-700" />
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Cadastrar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
