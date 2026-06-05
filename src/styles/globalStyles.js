import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // LOGIN
  containerLogin: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#003366' },
  logo: { fontSize: 40, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 15, color: '#1A1A2E', borderWidth: 1.5, borderColor: '#D0D5DD' },
  botaoEntrar: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold' },

  // GERAL E PERFIL
  container: { flex: 1, backgroundColor: '#F5F7FA', padding: 20 },
  card: { backgroundColor: '#fff', padding: 25, borderRadius: 15, alignItems: 'center', marginBottom: 20, elevation: 3 },
  fotoGrande: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#E1E1E1', marginBottom: 10, borderWidth: 3, borderColor: '#003366' },
  nome: { fontSize: 22, fontWeight: 'bold', color: '#003366', marginTop: 10 },
  emailTexto: { fontSize: 14, color: '#666', marginBottom: 15 },
  
  // MENU PERFIL E SENHA
  btnMenu: { backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#003366', marginBottom: 10 },
  btnMenuTexto: { color: '#003366', fontWeight: 'bold' },
  sessaoSenha: { marginTop: 10, backgroundColor: '#fff', padding: 20, borderRadius: 15, borderLeftWidth: 5, borderLeftColor: '#28a745' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  inputSenha: { backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 15, borderWidth: 1.5, borderColor: '#D0D5DD', color: '#1A1A2E' },
  btnConfirmar: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center' },

  // FOTO DINÂMICA
  btnAcaoFoto: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginTop: 5 },
  areaEdicaoFoto: { alignItems: 'center', backgroundColor: '#E8F5E9', padding: 20, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#28a745' },
  btnAzul: { backgroundColor: '#003366', padding: 12, borderRadius: 8, marginTop: 10, width: '100%', alignItems: 'center' },
  btnVermelho: { backgroundColor: '#ff4d4d', padding: 10, borderRadius: 8, marginTop: 10, width: '60%', alignItems: 'center' },

  // NAVBAR (HEADER)
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  navBtn: { paddingHorizontal: 12, paddingVertical: 4 },
  navText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 },
  divisor: { width: 1, height: 15, backgroundColor: 'rgba(255,255,255,0.3)' }
});