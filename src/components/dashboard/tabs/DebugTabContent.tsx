
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bug, Database, Users } from 'lucide-react';
import UserManagement from '../UserManagement';
import { ToastFunction } from '../types';

interface DebugTabContentProps {
  toast: ToastFunction;
}

const DebugTabContent: React.FC<DebugTabContentProps> = ({ toast }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Ferramentas de Debug
          </CardTitle>
          <CardDescription>
            Ferramentas para diagnóstico e resolução de problemas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Base de Dados
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="mt-4">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="database" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Base de Dados</CardTitle>
                  <CardDescription>
                    Informações sobre o estado atual da base de dados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Tabelas Principais</h3>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• users (perfis de usuário)</li>
                          <li>• entradas (receitas)</li>
                          <li>• gastos (despesas)</li>
                          <li>• lembretes_pagamento</li>
                          <li>• metas</li>
                          <li>• archived_periods</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Triggers Ativos</h3>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• on_auth_user_created</li>
                          <li>• on_user_registration</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h3 className="font-medium mb-2 text-blue-800">Fluxo de Registro</h3>
                      <ol className="text-sm space-y-1 text-blue-700">
                        <li>1. Usuário preenche formulário de registro</li>
                        <li>2. supabase.auth.signUp() cria usuário em auth.users</li>
                        <li>3. Trigger on_auth_user_created executa handle_new_user()</li>
                        <li>4. handle_new_user() insere/atualiza dados em public.users</li>
                        <li>5. Trigger on_user_registration executa notify_user_registration()</li>
                        <li>6. notify_user_registration() chama edge function para webhook</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugTabContent;
