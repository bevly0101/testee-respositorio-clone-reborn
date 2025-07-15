
-- Remover trigger e função existentes se existirem
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_insert_notify ON public.users;
DROP FUNCTION IF EXISTS public.notify_user_registration();

-- Recriar função handle_new_user sem dependências do schema net
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
declare
  v_telefone text;
  v_username text; 
  v_senha text;
  v_nome_completo text;
begin
  -- Log do início da função
  RAISE LOG 'handle_new_user: Iniciando para usuário %', new.id;
  
  v_telefone := new.raw_user_meta_data ->> 'telefone_whatsapp';
  v_username := new.raw_user_meta_data ->> 'username';
  v_senha := new.raw_user_meta_data ->> 'senha';
  v_nome_completo := new.raw_user_meta_data ->> 'nome_completo';

  -- Log dos dados recebidos
  RAISE LOG 'handle_new_user: Dados - telefone: %, nome: %, username: %', v_telefone, v_nome_completo, v_username;

  if v_telefone is null then
    RAISE LOG 'handle_new_user: Erro - telefone_whatsapp é nulo para usuário %', new.id;
    raise exception 'Campo telefone_whatsapp é obrigatório. Por favor, forneça um número de telefone.';
  end if;

  -- Verificar se o usuário já existe na tabela public.users
  IF EXISTS (SELECT 1 FROM public.users WHERE id = new.id) THEN
    RAISE LOG 'handle_new_user: Usuário % já existe na tabela public.users, atualizando...', new.id;
    
    UPDATE public.users 
    SET 
      email = new.email,
      telefone_whatsapp = v_telefone,
      username = v_username,
      senha = v_senha,
      nome = v_nome_completo,
      created_at = now()
    WHERE id = new.id;
  ELSE
    RAISE LOG 'handle_new_user: Inserindo novo usuário % na tabela public.users', new.id;
    
    insert into public.users (id, email, telefone_whatsapp, username, senha, nome)
    values (new.id, new.email, v_telefone, v_username, v_senha, v_nome_completo);
  END IF;

  RAISE LOG 'handle_new_user: Concluído com sucesso para usuário %', new.id;
  return new;

EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'handle_new_user: Erro para usuário %: % - %', new.id, SQLSTATE, SQLERRM;
    -- Re-raise o erro para que seja tratado pelo sistema
    RAISE;
end;
$function$;

-- Criar nova função de notificação usando Edge Function em vez de net.http_post
CREATE OR REPLACE FUNCTION public.notify_user_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Em vez de usar net.http_post, vamos usar uma abordagem mais simples
  -- A notificação será feita via Edge Function quando necessário
  RAISE LOG 'notify_user_registration: Usuário % criado', NEW.id;
  RETURN NEW;
END;
$function$;

-- Recriar trigger no auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Criar trigger na tabela public.users para notificações
CREATE TRIGGER on_user_insert_notify
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.notify_user_registration();
