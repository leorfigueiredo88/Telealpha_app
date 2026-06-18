import { Platform, StyleSheet } from 'react-native';
import { COLORS, INPUT, SIZES } from '../../constants/theme';

export const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';

export const styles = StyleSheet.create({
  // ── Layout ──────────────────────────────────────────────
  container:       { flex: 1, backgroundColor: COLORS.bg },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 28 },
  logo:            { width: '80%', height: 140, marginBottom: -10, alignSelf: 'center' },
  appNome:         { fontSize: 36, fontWeight: 'bold', color: '#003366', textAlign: 'center', marginBottom: 6, letterSpacing: 1 },
  appNomePlus:     { color: '#E63946' },
  subtitulo:       { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 32 },

  // ── Inputs ───────────────────────────────────────────────
  input: {
    backgroundColor: INPUT.backgroundColor,
    borderWidth: INPUT.borderWidth,
    borderColor: INPUT.borderColor,
    borderRadius: INPUT.borderRadius,
    padding: INPUT.padding,
    fontSize: INPUT.fontSize,
    color: INPUT.color,
    marginBottom: 14,
  },
  inputSenhaContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: INPUT.backgroundColor,
    borderWidth: INPUT.borderWidth,
    borderColor: INPUT.borderColor,
    borderRadius: INPUT.borderRadius,
    marginBottom: 22,
  },
  inputSenha: { flex: 1, padding: INPUT.padding, fontSize: INPUT.fontSize, color: INPUT.color },
  eyeIcon:    { padding: INPUT.padding },

  // ── Botão entrar ─────────────────────────────────────────
  btnEntrar: {
    backgroundColor: COLORS.primary,
    padding: 18, borderRadius: SIZES.radius,
    alignItems: 'center', elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 6,
  },
  btnTexto: { color: COLORS.white, fontSize: 17, fontWeight: 'bold', letterSpacing: 0.5 },
});
