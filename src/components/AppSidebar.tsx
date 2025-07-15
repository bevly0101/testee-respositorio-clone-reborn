
import React, { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, History, Settings, User, LogOut, Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from "@/components/ui/sidebar";
import { useResponsive } from '@/hooks/useResponsive';
import RemindersModal from './dashboard/RemindersModal';
import HistoryModal from './dashboard/HistoryModal';

interface AppSidebarProps {
  onHistoryClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
}

export function AppSidebar({ 
  onSettingsClick
}: AppSidebarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setOpen, open, state, openMobile, setOpenMobile } = useSidebar();
  const { isMobile } = useResponsive();
  const [isRemindersOpen, setIsRemindersOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    // Fecha o sidebar no mobile após navegação
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleHistoryClick = () => {
    setIsHistoryOpen(true);
    // Fecha o sidebar no mobile após abrir modal
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleRemindersClick = () => {
    setIsRemindersOpen(true);
    // Fecha o sidebar no mobile após abrir modal
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleMenuItemClick = (onClick: () => void) => {
    onClick();
    // Fecha o sidebar no mobile após qualquer ação
    if (isMobile) {
      setOpen(false);
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      onClick: () => navigate('/dashboard'),
    },
    {
      title: "Perfil",
      icon: User,
      onClick: handleProfileClick,
    },
    {
      title: "Lembretes",
      icon: Bell,
      onClick: handleRemindersClick,
    },
    {
      title: "Histórico",
      icon: History,
      onClick: handleHistoryClick,
    },
    {
      title: "Configurações",
      icon: Settings,
      onClick: onSettingsClick,
    },
  ];

  const isCollapsed = state === 'collapsed';

  return (
    <>
      <Sidebar 
        className="border-r"
        collapsible="icon"
        side="left"
      >
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                alt="AutoFinance Logo" 
                src="/lovable-uploads/d26be550-b458-42d4-82c9-9cc2a23b1720.png" 
                className="h-8 w-auto flex-shrink-0" 
              />
              {!isCollapsed && (
                <span className="font-bold text-lg text-autofinance-blue">
                  Auto<span className="text-gray-800">Finance</span>
                </span>
              )}
            </div>
            {!isMobile && (
              <SidebarTrigger className="h-6 w-6" />
            )}
          </div>
        </SidebarHeader>
        
        <SidebarContent className="py-4">
          <SidebarGroup>
            {!isCollapsed && (
              <SidebarGroupLabel className="px-4 mb-2 text-sm font-medium text-gray-600">
                Menu Principal
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="px-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => handleMenuItemClick(item.onClick)}
                      className="w-full justify-start gap-3 px-3 py-2.5 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                      tooltip={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                      {!isCollapsed && <span className="text-gray-700">{item.title}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t bg-gray-50">
          <div className="space-y-3">
            {!isCollapsed && (
              <div className="text-sm text-gray-600 px-2 flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="truncate">{user?.email?.split('@')[0]}</span>
              </div>
            )}
            <Button 
              variant="outline" 
              size={isCollapsed ? "icon" : "sm"}
              onClick={() => handleMenuItemClick(handleLogout)}
              className={`${isCollapsed ? 'w-10 h-10' : 'w-full'} justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300`}
              title={isCollapsed ? "Sair da Conta" : undefined}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!isCollapsed && <span className="ml-2">Sair da Conta</span>}
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <RemindersModal 
        isOpen={isRemindersOpen} 
        onClose={() => setIsRemindersOpen(false)} 
      />

      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
      />
    </>
  );
}
