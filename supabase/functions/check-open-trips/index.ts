import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Busca viagens em aberto (sem data_fim)
  const { data: viagensAbertas, error } = await supabase
    .from('movimentacoes')
    .select('motorista_nome')
    .is('data_fim', null);

  if (error) {
    return new Response(JSON.stringify({ erro: error.message }), { status: 500 });
  }

  if (!viagensAbertas || viagensAbertas.length === 0) {
    return new Response(JSON.stringify({ mensagem: 'Nenhuma viagem em aberto.' }), { status: 200 });
  }

  // Nomes únicos dos motoristas com viagem aberta
  const nomes = [...new Set(viagensAbertas.map(v => v.motorista_nome))];

  // Busca tokens push desses motoristas
  const { data: motoristas } = await supabase
    .from('usuarios')
    .select('nome, expo_push_token')
    .in('nome', nomes)
    .eq('perfil', 'motorista')
    .not('expo_push_token', 'is', null);

  if (!motoristas || motoristas.length === 0) {
    return new Response(JSON.stringify({ mensagem: 'Nenhum token encontrado.' }), { status: 200 });
  }

  // Monta mensagens para a API do Expo
  const mensagens = motoristas.map(m => ({
    to: m.expo_push_token,
    title: '⚠️ Viagem não finalizada — Frota+',
    body: 'São 17h30 e sua viagem ainda está em aberto. Registre o encerramento.',
    sound: 'default',
    priority: 'high',
    channelId: 'default',
    data: { tela: 'Motorista' },
  }));

  // Envia via Expo Push API
  const resposta = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
    },
    body: JSON.stringify(mensagens),
  });

  const resultado = await resposta.json();

  return new Response(
    JSON.stringify({ enviadas: mensagens.length, motoristas: nomes, resultado }),
    { headers: { 'Content-Type': 'application/json' }, status: 200 }
  );
});
