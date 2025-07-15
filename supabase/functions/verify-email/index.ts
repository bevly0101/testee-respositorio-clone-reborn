
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyEmailRequest {
  token: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { token, userId }: VerifyEmailRequest = await req.json();

    console.log('Verificando email para usuário:', userId);

    // Hash do token recebido
    const tokenHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(token)
    );
    const tokenHashString = Array.from(new Uint8Array(tokenHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Buscar usuário com o token
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, token_verificacao, token_expira_em, email_verificado')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('Usuário não encontrado:', userError);
      return new Response(
        JSON.stringify({ 
          error: "Usuário não encontrado",
          success: false 
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Verificar se o email já foi verificado
    if (user.email_verificado) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Email já verificado",
          alreadyVerified: true 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Verificar se o token está correto
    if (user.token_verificacao !== tokenHashString) {
      console.error('Token inválido');
      return new Response(
        JSON.stringify({ 
          error: "Token de verificação inválido",
          success: false 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Verificar se o token não expirou
    const now = new Date();
    const expiresAt = new Date(user.token_expira_em);
    
    if (now > expiresAt) {
      console.error('Token expirado');
      return new Response(
        JSON.stringify({ 
          error: "Token de verificação expirado",
          success: false,
          expired: true 
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Marcar email como verificado na tabela users
    const { error: updateError } = await supabase
      .from('users')
      .update({
        email_verificado: true,
        token_verificacao: null,
        token_expira_em: null,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Erro ao atualizar usuário:', updateError);
      throw updateError;
    }

    // Também confirmar o email no Supabase Auth
    try {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        { email_confirm: true }
      );

      if (authError) {
        console.error('Erro ao confirmar email no Auth:', authError);
        // Não falhar a operação por causa disso
      }
    } catch (authError) {
      console.error('Erro ao confirmar email no Auth:', authError);
      // Não falhar a operação por causa disso
    }

    // Atualizar log de verificação
    await supabase
      .from('email_verification_logs')
      .update({
        status: 'verified',
        verificado_em: now.toISOString()
      })
      .eq('user_id', userId)
      .eq('token_hash', tokenHashString);

    console.log('Email verificado com sucesso para usuário:', userId);

    return new Response(JSON.stringify({ 
      success: true,
      message: "Email verificado com sucesso",
      user: {
        id: user.id,
        email: user.email,
        email_verificado: true
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Erro ao verificar email:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro interno do servidor",
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
