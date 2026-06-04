import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

// Comportamento do teclado isolado no arquivo de estilos
export const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
  },
  logo: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    alignSelf: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  inputSenhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    marginBottom: 20,
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
    backgroundColor: COLORS.primary || '#007AFF',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  btnTexto: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});