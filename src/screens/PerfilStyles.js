import { StyleSheet } from 'react-native';
import { COLORS, INPUT, SIZES } from '../constants/theme';

export const styles = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────
  container: { flex: 1, backgroundColor: COLORS.bg, padding: SIZES.padding },

  // ── Card de foto ─────────────────────────────────────────
  card: {
    backgroundColor: COLORS.white, padding: 25, borderRadius: 15,
    alignItems: 'center', marginBottom: 20, elevation: 3,
  },
  fotoGrande: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: '#E1E1E1', marginBottom: 10,
    borderWidth: 3, borderColor: COLORS.primary,
  },
  nome:       { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginTop: 10 },
  emailTexto: { fontSize: 14, color: '#666', marginBottom: 15 },

  // ── Botões de foto ───────────────────────────────────────
  btnAcaoFoto:    { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginTop: 5 },
  areaEdicaoFoto: {
    alignItems: 'center', backgroundColor: '#E8F5E9',
    padding: 20, borderRadius: 15, marginTop: 10,
    borderWidth: 1, borderColor: COLORS.success,
  },
  btnVermelho: {
    backgroundColor: COLORS.accent, padding: 10,
    borderRadius: SIZES.radius, marginTop: 10, width: '60%', alignItems: 'center',
  },

  // ── Botão menu de ações ──────────────────────────────────
  btnMenu:     { backgroundColor: COLORS.white, padding: 15, borderRadius: SIZES.radius, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary, marginBottom: 10 },
  btnMenuTexto: { color: COLORS.primary, fontWeight: 'bold' },

  // ── Seção de senha ───────────────────────────────────────
  sessaoSenha: {
    marginTop: 10, backgroundColor: COLORS.white, padding: 20,
    borderRadius: 15, borderLeftWidth: 5, borderLeftColor: COLORS.success,
  },
  label: { fontSize: 14, fontWeight: 'bold', color: COLORS.text, marginBottom: 5 },

  // ── Inputs ───────────────────────────────────────────────
  inputSenha: {
    backgroundColor: INPUT.backgroundColor,
    padding: INPUT.padding,
    borderRadius: INPUT.borderRadius,
    marginBottom: 15,
    borderWidth: INPUT.borderWidth,
    borderColor: INPUT.borderColor,
    color: INPUT.color,
    fontSize: INPUT.fontSize,
  },

  // ── Botão confirmar ──────────────────────────────────────
  btnConfirmar: {
    backgroundColor: COLORS.success, padding: 15,
    borderRadius: SIZES.radius, alignItems: 'center',
  },
});
