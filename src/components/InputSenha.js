import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/theme';

export default function InputSenha({ value, onChangeText, placeholder }) {
  const [visivel, setVisivel] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={!visivel}
      />
      <TouchableOpacity onPress={() => setVisivel(!visivel)} style={styles.icon}>
        <Ionicons name={visivel ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.border, borderRadius: 10, height: 50, marginBottom: 12 },
  input: { flex: 1, paddingHorizontal: 15, color: COLORS.text, height: '100%' },
  icon: { paddingHorizontal: 12 }
});