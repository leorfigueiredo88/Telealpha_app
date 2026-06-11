import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { INPUT } from '../../constants/theme';
import { supabase } from '../../services/supabase';
import { KEYBOARD_BEHAVIOR, styles } from './LoginStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [verSenha, setVerSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Atenção", "Por favor, preencha todos os campos.");
      return;
    }

    setCarregando(true);
    try {
      // 1. Autenticação via Supabase Auth (senha nunca vai ao banco em texto puro)
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: senha,
      });

      if (authError) {
        Alert.alert("Falha no Acesso", "E-mail ou senha incorretos.");
        return;
      }

      // 2. Busca o perfil (sem o campo senha)
      const { data: profile, error: profileError } = await supabase
        .from('usuarios')
        .select('id, nome, email, perfil, foto_url')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        Alert.alert("Erro", "Perfil de usuário não encontrado.");
        return;
      }

      if (profile.perfil === 'gestor') {
        navigation.replace('Gestor', { usuario: profile });
      } else {
        navigation.replace('Motorista', { usuario: profile });
      }

    } catch (err) {
      Alert.alert("Erro de Conexão", "Verifique sua internet.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={KEYBOARD_BEHAVIOR}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.subtitulo}>Faça login para continuar</Text>

          <TextInput
            placeholder="E-mail"
            placeholderTextColor={INPUT.placeholder}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.inputSenhaContainer}>
            <TextInput
              style={styles.inputSenha}
              placeholder="Senha"
              placeholderTextColor={INPUT.placeholder}
              secureTextEntry={!verSenha}
              value={senha}
              onChangeText={setSenha}
            />
            <TouchableOpacity
              onPressIn={() => setVerSenha(true)}
              onPressOut={() => setVerSenha(false)}
              activeOpacity={0.7}
              style={styles.eyeIcon}
            >
              <Ionicons name={verSenha ? "eye" : "eye-off"} size={22} color="#9AA5B4" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.btnEntrar}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.btnTexto}>ENTRAR</Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
