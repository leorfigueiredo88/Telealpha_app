import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
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
    color: '#555',
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D0D5DD',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 14,
    color: '#1A1A2E',
  },
  inputSenhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#D0D5DD',
    borderRadius: 12,
    marginBottom: 22,
  },
  inputSenha: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#1A1A2E',
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
