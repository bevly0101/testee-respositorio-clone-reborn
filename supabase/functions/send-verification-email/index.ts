
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.5';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationEmailRequest {
  email: string;
  userId: string;
  nome?: string;
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

    const { email, userId, nome }: VerificationEmailRequest = await req.json();

    console.log('Enviando email de verificação para:', email);

    // Gerar token de verificação
    const token = crypto.randomUUID();
    const tokenHash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(token)
    );
    const tokenHashString = Array.from(new Uint8Array(tokenHash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Definir expiração para 24 horas
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Salvar token no banco
    const { error: updateError } = await supabase
      .from('users')
      .update({
        token_verificacao: tokenHashString,
        token_expira_em: expiresAt.toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Erro ao salvar token:', updateError);
      throw updateError;
    }

    // Registrar log de verificação
    await supabase
      .from('email_verification_logs')
      .insert({
        user_id: userId,
        email: email,
        token_hash: tokenHashString,
        status: 'pending'
      });

    // URL de verificação - usar a URL da aplicação
    const appUrl = Deno.env.get('SUPABASE_URL')?.includes('dvorjprqlxqprhvqhbhn') 
      ? 'https://dvorjprqlxqprhvqhbhn.lovable.app'
      : 'http://localhost:5173';
    
    const verificationUrl = `${appUrl}/verify-email?token=${token}&userId=${userId}`;

    const emailResponse = await resend.emails.send({
      from: "AutoFinance <noreply@resend.dev>",
      to: [email],
      subject: "Verifique seu email - AutoFinance",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">AutoFinance</h1>
          </div>
          
          <h2 style="color: #333; margin-bottom: 20px;">Olá${nome ? `, ${nome}` : ''}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Obrigado por se cadastrar no AutoFinance! Para completar seu cadastro e ter acesso a todas as funcionalidades, precisamos verificar seu email.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Verificar Email
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Ou copie e cole este link no seu navegador:
          </p>
          
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all; color: #333; font-family: monospace;">
            ${verificationUrl}
          </p>
          
          <p style="color: #999; font-size: 14px; margin-top: 30px;">
            Este link expira em 24 horas. Se você não solicitou esta verificação, pode ignorar este email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            AutoFinance - Seu controle financeiro pessoal
          </p>
        </div>
      `,
    });

    console.log("Email enviado com sucesso:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email de verificação enviado com sucesso",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Erro ao enviar email de verificação:", error);
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
