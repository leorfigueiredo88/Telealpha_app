// Converte data do Supabase para formato legível
export const formatarDataHora = (dataIso) => {
  if (!dataIso) return "-";
  const d = new Date(dataIso);
  return d.toLocaleDateString('pt-BR') + " às " + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};