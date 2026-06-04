import { StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

export const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, padding: SIZES.padding },
  menuGrid: { marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardMenu: { width: '48%', backgroundColor: COLORS.secondary, borderRadius: 15, padding: 15, alignItems: 'center' },
  cardRelatorio: { backgroundColor: COLORS.secondary, borderRadius: 15, padding: 15, flexDirection: 'row', alignItems: 'center' },
  cardAtivo: { backgroundColor: COLORS.primary },
  cardTitulo: { fontWeight: 'bold', color: COLORS.primary },
  inputBusca: { backgroundColor: COLORS.border, padding: 12, borderRadius: 10, marginBottom: 10 },
  itemLista: { backgroundColor: COLORS.secondary, padding: 15, borderRadius: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 5, borderLeftColor: COLORS.primary },
  itemNome: { fontWeight: 'bold' },
  itemDetalhe: { color: COLORS.textSecondary, fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalForm: { backgroundColor: 'white', padding: 25, borderRadius: 20 },
  input: { backgroundColor: COLORS.border, padding: 12, borderRadius: 10, marginBottom: 10 },
  btnSalvar: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10, alignItems: 'center' },
  btnFlutuante: { position: 'absolute', bottom: 30, right: 30, backgroundColor: COLORS.primary, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 }
});