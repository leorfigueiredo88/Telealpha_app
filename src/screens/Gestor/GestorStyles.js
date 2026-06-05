import { Dimensions, StyleSheet } from 'react-native';
import { COLORS, INPUT, SIZES } from '../../constants/theme';

const { width } = Dimensions.get('window');

export const s = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────
  container:   { flex: 1, backgroundColor: COLORS.bg, padding: SIZES.padding },
  menuGrid:    { marginBottom: 20 },
  row:         { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },

  // ── Cards de abas ───────────────────────────────────────
  cardMenu: {
    width: '48%', backgroundColor: COLORS.white, borderRadius: 15,
    padding: 15, height: 90, justifyContent: 'center', alignItems: 'center', elevation: 2,
  },
  cardRelatorio: {
    width: '100%', backgroundColor: COLORS.white, borderRadius: 15,
    padding: 15, height: 70, flexDirection: 'row', alignItems: 'center', elevation: 2,
  },
  cardAtivo:  { backgroundColor: COLORS.primary },
  cardTitulo: { fontSize: 14, fontWeight: 'bold', color: COLORS.primary },

  // ── Busca e lista ────────────────────────────────────────
  buscaContainer: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    borderWidth: INPUT.borderWidth, borderColor: INPUT.borderColor,
    padding: 12, borderRadius: INPUT.borderRadius,
    alignItems: 'center', marginBottom: 10,
  },
  itemLista: {
    backgroundColor: COLORS.white, padding: 15, borderRadius: SIZES.radius,
    marginBottom: 8, flexDirection: 'row', alignItems: 'center',
    borderLeftWidth: 5, borderLeftColor: COLORS.primary,
  },
  itemNome:    { fontWeight: 'bold', color: COLORS.text, fontSize: 16 },
  itemDetalhe: { color: '#666', fontSize: 12 },
  itemSelecionado: { backgroundColor: '#EBF4FF', borderLeftColor: COLORS.success },

  // ── Modais ───────────────────────────────────────────────
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', padding: SIZES.padding,
  },
  modalForm: { backgroundColor: COLORS.white, padding: 25, borderRadius: 20, elevation: 10 },
  modalConteudo: {
    backgroundColor: COLORS.white, borderTopLeftRadius: 25, borderTopRightRadius: 25,
    padding: 25, height: '80%', marginTop: 'auto',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15 },

  // ── Inputs ───────────────────────────────────────────────
  input: {
    backgroundColor: INPUT.backgroundColor,
    padding: INPUT.padding,
    borderRadius: INPUT.borderRadius,
    marginBottom: 10,
    borderWidth: INPUT.borderWidth,
    borderColor: INPUT.borderColor,
    color: INPUT.color,
  },
  inputSenhaContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: INPUT.backgroundColor,
    borderRadius: INPUT.borderRadius,
    height: 52, marginBottom: 10,
    borderWidth: INPUT.borderWidth, borderColor: INPUT.borderColor,
  },

  // ── Botões ───────────────────────────────────────────────
  btnSalvar: {
    backgroundColor: COLORS.primary, padding: 15,
    borderRadius: SIZES.radius, alignItems: 'center', marginTop: 10,
  },
  btnFlutuante: {
    position: 'absolute', bottom: 30, right: 30,
    backgroundColor: COLORS.primary, width: 65, height: 65,
    borderRadius: 35, justifyContent: 'center', alignItems: 'center', elevation: 10,
  },

  // ── Barra de seleção de relatórios ──────────────────────
  barraSelecao: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10, paddingHorizontal: 4,
  },
  btnSelecionarTodos: { flexDirection: 'row', alignItems: 'center' },
  txtSelecionarTodos: { fontSize: 13, color: COLORS.primary, marginLeft: 6 },
  btnGerarPDF: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 10,
  },
  txtGerarPDF: { color: COLORS.white, fontWeight: 'bold', fontSize: 13, marginLeft: 6 },

  // ── Detalhe de relatório ─────────────────────────────────
  label:  { fontSize: 10, color: '#999', fontWeight: 'bold', marginTop: 15, marginBottom: 2 },
  valor:  { fontSize: 16, color: COLORS.text, fontWeight: 'bold' },
  kmDestaque: {
    backgroundColor: COLORS.primary, padding: 15,
    borderRadius: SIZES.radius, marginTop: 20, alignItems: 'center',
  },
  btnPdfModal: {
    backgroundColor: '#d32f2f', flexDirection: 'row', padding: 15,
    borderRadius: SIZES.radius, marginTop: 30, justifyContent: 'center', alignItems: 'center',
  },

  // ── Menu lateral ─────────────────────────────────────────
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menuLateral: {
    width: width * 0.78, height: '100%', backgroundColor: COLORS.white,
    padding: 25, borderTopRightRadius: 30, borderBottomRightRadius: 30,
  },
  menuHeader: {
    alignItems: 'center', marginBottom: 30,
    borderBottomWidth: 1, borderBottomColor: '#EEE',
    paddingBottom: 20, marginTop: 40,
  },
  containerAvatar: {
    width: 100, height: 100, borderRadius: 50,
    overflow: 'hidden', backgroundColor: '#F0F0F0',
    marginBottom: 10, borderWidth: 3, borderColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  fotoPerfil:     { width: '100%', height: '100%' },
  menuNome:       { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 4 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F9F9F9',
  },
  menuItemTexto:     { fontSize: 16, marginLeft: 15, color: '#444' },
  menuItemSair:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, marginTop: 'auto' },
  menuItemTextoSair: { fontSize: 16, marginLeft: 15, color: COLORS.accent, fontWeight: 'bold' },

  // ── Modal perfil/senha ───────────────────────────────────
  modalOverlayCentro: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', padding: SIZES.padding,
  },
  modalCardPerfil: { backgroundColor: COLORS.white, padding: 25, borderRadius: 20, elevation: 10 },

  // ── Galeria de fotos ─────────────────────────────────────
  wrapperFotoGaleria: { margin: 5, position: 'relative' },
  fotoGaleriaGestor:  { width: 95, height: 95, borderRadius: 10, backgroundColor: '#F0F0F0' },
  btnExcluirFoto: {
    position: 'absolute', top: -8, right: -8,
    backgroundColor: COLORS.white, borderRadius: 11,
  },

  // ── Tela cheia ───────────────────────────────────────────
  fullImageContainer: { flex: 1, backgroundColor: 'black', justifyContent: 'center' },
  fullImage:          { width: width, height: width },
  btnCloseFull:       { position: 'absolute', top: 50, right: 20, zIndex: 10 },
});
