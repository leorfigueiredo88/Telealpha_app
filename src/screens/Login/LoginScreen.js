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
  useColorScheme,
  View
} from 'react-native';

import { supabase } from '../../services/supabase';
import { KEYBOARD_BEHAVIOR, TEMA, layout } from './LoginStyles';

export default function LoginScreen({ navigation }) {
  const scheme = useColorScheme();
  const t = TEMA[scheme === 'dark' ? 'dark' : 'light'];

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
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email.trim())
        .eq('senha', senha)
        .single();

      if (error || !data) {
        Alert.alert("Falha no Acesso", "E-mail ou senha incorretos.");
        setCarregando(false);
        return;
      }

      if (data.perfil === 'gestor') {
        navigation.replace('Gestor', { usuario: data });
      } else {
        navigation.replace('Motorista', { usuario: data });
      }

    } catch (err) {
      Alert.alert("Erro de Conexão", "Verifique sua internet.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[layout.container, { backgroundColor: t.bg }]}
      behavior={KEYBOARD_BEHAVIOR}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={layout.scrollContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../../../assets/images/logo.png')}
            style={layout.logo}
            resizeMode="contain"
            // tintColor aplica cor à imagem PNG com canal alpha:
            // no dark mode deixa a logo visível em branco,
            // no light mode usa a cor original (undefined = sem filtro)
            tintColor={scheme === 'dark' ? '#FFFFFF' : undefined}
          />

          <Text style={[layout.subtitulo, { color: t.subtitulo }]}>
            Faça login para continuar
          </Text>

          <TextInput
            placeholder="E-mail"
            placeholderTextColor={t.placeholder}
            style={[layout.input, {
              backgroundColor: t.inputBg,
              borderColor: t.inputBorda,
              color: t.inputTexto,
            }]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            keyboardAppearance={scheme === 'dark' ? 'dark' : 'light'}
          />

          <View style={[layout.inputSenhaContainer, {
            backgroundColor: t.inputBg,
            borderColor: t.inputBorda,
          }]}>
            <TextInput
              style={[layout.inputSenha, { color: t.inputTexto }]}
              placeholder="Senha"
              placeholderTextColor={t.placeholder}
              secureTextEntry={!verSenha}
              value={senha}
              onChangeText={setSenha}
              keyboardAppearance={scheme === 'dark' ? 'dark' : 'light'}
            />
            <TouchableOpacity
              onPressIn={() => setVerSenha(true)}
              onPressOut={() => setVerSenha(false)}
              activeOpacity={0.7}
              style={layout.eyeIcon}
            >
              <Ionicons
                name={verSenha ? "eye" : "eye-off"}
                size={22}
                color={t.icone}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={layout.btnEntrar}
            onPress={handleLogin}
            disabled={carregando}
          >
            {carregando
              ? <ActivityIndicator color="#FFF" />
              : <Text style={layout.btnTexto}>ENTRAR</Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
