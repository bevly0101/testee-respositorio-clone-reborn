
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, RefreshCw, Search, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserConsistencyCheck {
  status: 'auth_only' | 'public_only' | 'both_tables';
  id: string;
  email: string;
  auth_created_at: string | null;
  public_created_at: string | null;
}

const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserConsistencyCheck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState('');

  const fetchUserConsistency = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_consistency_check')
        .select('*')
        .order('status', { ascending: true });

      if (error) {
        console.error('Erro ao buscar consistência de usuários:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados de consistência.",
          variant: "destructive"
        });
        return;
      }

      // Validar e transformar os dados para garantir que status seja do tipo correto
      const validatedUsers: UserConsistencyCheck[] = (data || []).map(user => {
        const validStatuses = ['auth_only', 'public_only', 'both_tables'] as const;
        const status = validStatuses.includes(user.status as any) 
          ? user.status as 'auth_only' | 'public_only' | 'both_tables'
          : 'both_tables'; // fallback padrão

        return {
          status,
          id: user.id || '',
          email: user.email || '',
          auth_created_at: user.auth_created_at,
          public_created_at: user.public_created_at
        };
      });

      setUsers(validatedUsers);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro ao carregar os dados.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUserCompletely = async (userId: string) => {
    if (!userId.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um ID de usuário válido.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Iniciando exclusão completa do usuário:', userId);

      // Primeiro, chamar a função para limpar dados da tabela public
      const { data, error: functionError } = await supabase
        .rpc('delete_user_completely', { user_id: userId });

      if (functionError) {
        console.error('Erro na função de exclusão:', functionError);
        toast({
          title: "Erro",
          description: "Erro ao excluir dados do usuário da base de dados.",
          variant: "destructive"
        });
        return;
      }

      console.log('Dados públicos excluídos com sucesso');

      // Tentar excluir do Supabase Auth (pode falhar se já excluído)
      try {
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError && !authError.message.includes('User not found')) {
          console.warn('Aviso na exclusão do auth:', authError);
        } else {
          console.log('Usuário excluído do auth com sucesso');
        }
      } catch (authErr) {
        console.warn('Usuário pode já ter sido excluído do auth:', authErr);
      }

      toast({
        title: "Sucesso",
        description: "Usuário excluído completamente do sistema.",
      });

      // Limpar o campo e recarregar dados
      setUserToDelete('');
      await fetchUserConsistency();

    } catch (error) {
      console.error('Erro inesperado na exclusão:', error);
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro durante a exclusão.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserConsistency();
  }, []);

  const filteredUsers = users.filter(u => 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'auth_only':
        return <Badge variant="destructive">Apenas Auth</Badge>;
      case 'public_only':
        return <Badge variant="secondary">Apenas Public</Badge>;
      case 'both_tables':
        return <Badge variant="default">Consistente</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'auth_only':
        return 'Usuário existe apenas na tabela auth.users (trigger pode ter falhado)';
      case 'public_only':
        return 'Usuário existe apenas na tabela public.users (órfão)';
      case 'both_tables':
        return 'Usuário existe em ambas as tabelas (situação normal)';
      default:
        return 'Status desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
          <CardDescription>
            Ferramenta para verificar consistência e gerenciar usuários no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Seção de busca e atualização */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por email ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={fetchUserConsistency}
                disabled={isLoading}
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {/* Seção de exclusão de usuário */}
            <div className="border rounded-lg p-4 bg-red-50">
              <h3 className="font-medium text-red-800 mb-2">Exclusão Completa de Usuário</h3>
              <p className="text-sm text-red-600 mb-3">
                Esta ação irá excluir o usuário de todas as tabelas do sistema permanentemente.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="ID do usuário para excluir"
                  value={userToDelete}
                  onChange={(e) => setUserToDelete(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={() => deleteUserCompletely(userToDelete)}
                  disabled={isLoading || !userToDelete.trim()}
                  variant="destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>

            {/* Lista de usuários */}
            <div className="space-y-2">
              <h3 className="font-medium">Status de Consistência dos Usuários ({filteredUsers.length})</h3>
              
              {isLoading ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Carregando dados...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">Nenhum usuário encontrado.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredUsers.map((userRecord) => (
                    <div 
                      key={userRecord.id} 
                      className="border rounded-lg p-3 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(userRecord.status)}
                          <span className="font-mono text-sm text-gray-600">
                            {userRecord.id}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{userRecord.email}</p>
                        <p className="text-xs text-gray-500">
                          {getStatusDescription(userRecord.status)}
                        </p>
                        {userRecord.auth_created_at && (
                          <p className="text-xs text-gray-400">
                            Auth: {new Date(userRecord.auth_created_at).toLocaleString('pt-BR')}
                          </p>
                        )}
                        {userRecord.public_created_at && (
                          <p className="text-xs text-gray-400">
                            Public: {new Date(userRecord.public_created_at).toLocaleString('pt-BR')}
                          </p>
                        )}
                      </div>
                      
                      <Button
                        onClick={() => setUserToDelete(userRecord.id)}
                        variant="outline"
                        size="sm"
                        className="ml-2"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
