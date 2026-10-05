import { supabaseAdmin } from '../../config/supabase';

type EventoAuditoria = {
  usuarioId?: string | null;
  acao: string;
  entidade: string;
  registroId?: string | null;
  detalhes?: Record<string, unknown>;
};

// Registra eventos que o banco nao enxerga sozinho (ex.: login).
// Usa a service role, que e o uso correto dela: rotina interna do backend.
export async function registrarAuditoria(evento: EventoAuditoria) {
  try {
    const { error } = await supabaseAdmin.from('audit_log').insert({
      usuario_id: evento.usuarioId ?? null,
      acao: evento.acao,
      entidade: evento.entidade,
      registro_id: evento.registroId ?? null,
      dados_depois: evento.detalhes ?? null,
      origem: 'backend',
    });
    if (error) console.error('Falha ao registrar auditoria:', error.message);
  } catch (e) {
    console.error('Falha ao registrar auditoria:', e);
  }
}