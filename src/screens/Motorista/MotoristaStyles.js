import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40, marginBottom: 20 },
  saudacao: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  headerSpacer: { width: 30 },

  secaoTitulo: { fontSize: 12, fontWeight: 'bold', color: '#666', marginBottom: 15 },
  veiculoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 18, borderRadius: 15, marginBottom: 12 },
  veiculoSelecionado: { borderColor: COLORS.primary, borderWidth: 2, backgroundColor: '#EBF4FF' },
  veiculoInfo: { marginLeft: 15 },
  veiculoModelo: { fontWeight: 'bold', fontSize: 17 },
  veiculoPlaca: { color: '#666' },
  btnIniciar: { backgroundColor: COLORS.success, padding: 20, borderRadius: 15, alignItems: 'center' },
  btnTexto: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  btnDesabilitado: { opacity: 0.5 },

  containerViagemFocada: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardViagemAtivaFocada: { backgroundColor: COLORS.primary, width: '100%', padding: 25, borderRadius: 30, alignItems: 'center', elevation: 10 },
  txtViagemModelo: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  txtViagemPlaca: { color: 'white', fontSize: 18, opacity: 0.9 },
  badgeRota: { backgroundColor: COLORS.success, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginTop: 12 },
  badgeTexto: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  btnEncerrarGrande: { backgroundColor: COLORS.accent, width: '100%', padding: 20, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  btnTextoEncerrar: { color: 'white', fontWeight: 'bold', fontSize: 18, marginLeft: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menuLateral: { width: width * 0.8, height: '100%', backgroundColor: 'white', padding: 25, borderTopRightRadius: 30, borderBottomRightRadius: 30 },
  menuHeader: { alignItems: 'center', marginBottom: 30, borderBottomWidth: 1, borderBottomColor: '#EEE', paddingBottom: 20 },
  containerAvatar: { width: 100, height: 100, borderRadius: 50, overflow: 'hidden', backgroundColor: '#F0F0F0', marginBottom: 10, borderWidth: 3, borderColor: COLORS.primary },
  fotoPerfil: { width: '100%', height: '100%' },
  menuNome: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F9F9F9' },
  menuItemTexto: { fontSize: 16, marginLeft: 15, color: '#444' },
  menuItemSair: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, marginTop: 'auto' },
  menuItemTextoSair: { fontSize: 16, marginLeft: 15, color: COLORS.accent, fontWeight: 'bold' },

  modalOverlayCenter: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalCardCustom: { backgroundColor: 'white', padding: 25, borderRadius: 25, elevation: 5 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginBottom: 20, textAlign: 'center' },
  inputViagemCustom: { backgroundColor: '#F0F2F5', padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16 },
  btnFecharTexto: { color: '#999', fontSize: 14, textAlign: 'center', marginTop: 10 },

  modalChecklistContainer: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
  modalTituloChecklist: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginTop: 40, marginBottom: 20 },
  formViagem: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 2 },
  labelInput: { fontSize: 14, fontWeight: 'bold', color: '#666', marginBottom: 5 },
  inputViagem: { backgroundColor: '#F0F2F5', padding: 15, borderRadius: 12, marginBottom: 10, fontSize: 16 },
  
  itemChecklist: { backgroundColor: 'white', padding: 15, borderRadius: 20, marginBottom: 12, elevation: 2 },
  rowChecklistMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelSetor: { fontSize: 15, fontWeight: 'bold', color: '#333', flex: 1 },
  containerFotosECamera: { flexDirection: 'row', alignItems: 'center', flex: 2.5, justifyContent: 'flex-end' },
  scrollFotosInterno: { paddingRight: 5, alignItems: 'center' },
  boxFotoMiniChecklist: { width: 48, height: 48, borderRadius: 8, marginLeft: 6, backgroundColor: '#F0F0F0', borderWidth: 1, borderColor: '#DDD' },
  btnCameraPequena: { backgroundColor: COLORS.primary, width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  
  btnConfirmarIniciar: { backgroundColor: COLORS.primary, padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 10 },
  btnVoltarChecklist: { alignSelf: 'center', marginTop: 15, marginBottom: 30 },
  btnVoltarTexto: { color: COLORS.accent, fontWeight: 'bold', fontSize: 16 },

  fullImageContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
  fullImage: { width: width, height: height * 0.8 },
  btnCloseFull: { position: 'absolute', top: 50, right: 20, zIndex: 10 },

  // Fotos anteriores (viagens passadas) — borda cinza
  fotoAnterior: { borderWidth: 2, borderColor: '#AAAAAA' },
  // Fotos novas desta viagem — borda azul
  fotoNova: { borderWidth: 2, borderColor: '#003366' },
});