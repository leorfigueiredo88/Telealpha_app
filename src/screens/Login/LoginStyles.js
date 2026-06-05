import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';

// Paleta de cores por modo
export const TEMA = {
  light: {
    bg: '#F0F2F5',
    card: '#FFFFFF',
    texto: '#1A1A2E',
    subtitulo: '#666666',
    inputBg: '#FFFFFF',
    inputBorda: '#DDDDDD',
    inputTexto: '#1A1A2E',
    placeholder: '#999999',
    icone: '#666666',
    logoBg: 'transparent',
  },
  dark: {
    bg: '#0D1117',
    card: '#161B22',
    texto: '#F0F2F5',
    subtitulo: '#8B949E',
    inputBg: '#21262D',
    inputBorda: '#30363D',
    inputTexto: '#F0F2F5',
    placeholder: '#6E7681',
    icone: '#8B949E',
    logoBg: 'transparent',
  },
};

// Estilos estáticos (layout, sem cor)
export const layout = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28,
  },
  logo: {
    width: '80%',
    height: 140,
    marginBottom: 8,
    alignSelf: 'center',
  },
  subtitulo: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 14,
  },
  inputSenhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    marginBottom: 22,
  },
  inputSenha: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 15,
  },
  btnEntrar: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  btnTexto: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
