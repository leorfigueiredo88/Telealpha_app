import { StyleSheet } from 'react-native';
import { COLORS, INPUT, SIZES } from '../constants/theme';

export const styles = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────
  container: { flex: 1, backgroundColor: COLORS.bg },

  // ── Header ───────────────────────────────────────────────
  header: {
    backgroundColor: COLORS.primary, padding: SIZES.padding,
    paddingTop: 50, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
  },
  headerTitulo: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  btnGerarPdf: {
    backgroundColor: COLORS.success, paddingHorizontal: 15,
    paddingVertical: 8, borderRadius: 8,
    flexDirection: 'row', alignItems: 'center',
  },
  btnGerarPdfTexto: { color: COLORS.white, fontWeight: 'bold', marginLeft: 5 },

  // ── Barra de filtro ──────────────────────────────────────
  filtroContainer: {
    padding: 15, backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: INPUT.borderRadius,
    borderWidth: INPUT.borderWidth,
    borderColor: INPUT.borderColor,
    paddingHorizontal: 10,
  },
  inputBusca: {
    flex: 1, height: 45, marginLeft: 10,
    color: INPUT.color, fontSize: INPUT.fontSize,
  },
  totalTexto: { fontSize: 12, color: '#666', marginTop: 8, marginLeft: 5 },

  // ── Card de item ─────────────────────────────────────────
  card: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius,
    marginBottom: 12, borderLeftWidth: 5, borderLeftColor: COLORS.primary,
    padding: SIZES.padding, elevation: 2,
  },
  cardTopo:     { flexDirection: 'row', justifyContent: 'space-between' },
  cardVeiculo:  { fontWeight: 'bold', color: COLORS.primary },
  cardKm:       { color: COLORS.success, fontWeight: 'bold' },
  cardMotorista: { fontSize: 14, color: COLORS.text, marginVertical: 5 },
  cardRodape:   {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 5, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8,
  },
  labelData: { fontSize: 10, color: '#999' },
  valorData:  { fontSize: 11 },
});
