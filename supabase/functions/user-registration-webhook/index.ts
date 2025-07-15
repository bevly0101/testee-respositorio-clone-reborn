
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  type: 'INSERT';
  table: string;
  record: any;
  schema: string;
}

interface N8nWebhookData {
  wpp_number: string;
  name: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload: WebhookPayload = await req.json();
    
    // Verificar se é uma inserção na tabela users
    if (payload.type === 'INSERT' && payload.table === 'users') {
      const user = payload.record;
      
      // Preparar dados para o webhook n8n
      const webhookData: N8nWebhookData = {
        wpp_number: user.telefone_whatsapp || '',
        name: user.nome || user.username || ''
      };

      console.log('Enviando dados para webhook n8n:', webhookData);

      // Enviar requisição POST para o webhook n8n
      const response = await fetch('https://webhook.autosfinance.com.br/webhook/6f86dabd-d143-4f85-a62b-20aa582886e1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        const responseText = await response.text();
        console.log('Webhook enviado com sucesso:', responseText);
      } else {
        const errorText = await response.text();
        console.error('Erro ao enviar webhook:', response.status, errorText);
      }
    }

    return new Response('OK', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Erro na função webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
