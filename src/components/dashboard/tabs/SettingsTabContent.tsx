
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToastFunction } from '../types';

interface SettingsTabContentProps {
  toast: ToastFunction;
}

const SettingsTabContent: React.FC<SettingsTabContentProps> = ({ toast }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
        <CardDescription>Gerencie suas preferências e configurações de conta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="text-sm font-medium">Notificações</h3>
              <p className="text-sm text-gray-500">Receba alertas sobre suas finanças</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Em breve!",
                  description: "As configurações de notificações estarão disponíveis em breve."
                });
              }}
            >Configurar</Button>
          </div>
          
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="text-sm font-medium">Categorias</h3>
              <p className="text-sm text-gray-500">Personalize suas categorias de gastos</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Em breve!",
                  description: "O gerenciamento de categorias estará disponível em breve."
                });
              }}
            >Gerenciar</Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Integração bancária</h3>
              <p className="text-sm text-gray-500">Conecte suas contas bancárias</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Em breve!",
                  description: "A integração bancária estará disponível em breve."
                });
              }}
            >Conectar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTabContent;

