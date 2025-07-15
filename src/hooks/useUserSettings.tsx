
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserSettings = () => {
  const { user } = useAuth();
  const [especificarTipo, setEspecificarTipo] = useState(false);

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (user && user.id) {
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('especificar_tipo')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Erro ao buscar configurações do usuário:', error);
            return;
          }

          setEspecificarTipo(userData?.especificar_tipo || false);
        } catch (error) {
          console.error('Erro ao buscar configurações do usuário:', error);
        }
      }
    };

    fetchUserSettings();
  }, [user]);

  return { especificarTipo, setEspecificarTipo };
};
