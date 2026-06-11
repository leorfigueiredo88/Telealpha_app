import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react'; // Adicionado useRef
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { INPUT } from '../constants/theme';
import { supabase } from '../services/supabase';
import { styles } from './PerfilStyles';

const AVATAR_PADRAO = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export default function PerfilScreen({ route }) {
  const usuarioId = route.params?.usuario?.id;
  const [dadosUsuario, setDadosUsuario] = useState(route.params?.usuario);
  const [carregando, setCarregando] = useState(false);
  
  // Referência para controlar a rolagem
  const scrollRef = useRef(null);

  // Estados da Foto
  const [fotoLocal, setFotoLocal] = useState(null);
  const [exibirEdicaoFoto, setExibirEdicaoFoto] = useState(false);

  // Estados da Senha
  const [exibirFormSenha, setExibirFormSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  useEffect(() => {
    carregarDadosPerfil();
  }, []);

  const carregarDadosPerfil = async () => {
    const { data } = await supabase.from('usuarios').select('id, nome, email, perfil, foto_url').eq('id', usuarioId).single();
    if (data) {
      setDadosUsuario(data);
      setFotoLocal(data.foto_url);
    }
  };

  const selecionarFoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFotoLocal(result.assets[0].uri);
      setExibirEdicaoFoto(true);
    }
  };

  const salvarFotoNoBanco = async () => {
    setCarregando(true);
    const { error } = await supabase
      .from('usuarios')
      .update({ foto_url: fotoLocal })
      .eq('id', usuarioId);

    if (error) {
      Alert.alert("Erro", "Falha ao salvar foto.");
    } else {
      Alert.alert("Sucesso", "Foto atualizada!");
      setExibirEdicaoFoto(false);
      carregarDadosPerfil();
    }
    setCarregando(false);
  };

  const removerFoto = async () => {
    const { error } = await supabase.from('usuarios').update({ foto_url: null }).eq('id', usuarioId);
    if (!error) {
      setFotoLocal(null);
      setExibirEdicaoFoto(false);
      carregarDadosPerfil();
      Alert.alert("Sucesso", "Foto removida.");
    }
  };

  const handleUpdateSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) return Alert.alert("Aviso", "Preencha todos os campos.");
    if (novaSenha !== confirmarSenha) return Alert.alert("Aviso", "As novas senhas não coincidem.");
    if (novaSenha.length < 6) return Alert.alert("Aviso", "A nova senha deve ter no mínimo 6 dígitos.");

    setCarregando(true);

    // Verifica senha atual via re-autenticação
    const { error: reAuthError } = await supabase.auth.signInWithPassword({
      email: dadosUsuario.email,
      password: senhaAtual,
    });
    if (reAuthError) {
      setCarregando(false);
      return Alert.alert("Erro", "Senha atual incorreta.");
    }

    const { error } = await supabase.auth.updateUser({ password: novaSenha });

    if (error) {
      Alert.alert("Erro", "Falha ao atualizar senha.");
    } else {
      Alert.alert("Sucesso", "Senha alterada com sucesso!");
      setExibirFormSenha(false);
      setSenhaAtual(''); setNovaSenha(''); setConfirmarSenha('');
    }
    setCarregando(false);
  };

  // Função para abrir o formulário e rolar a tela para baixo
  const toggleFormSenha = () => {
    const novoEstado = !exibirFormSenha;
    setExibirFormSenha(novoEstado);
    
    if (novoEstado) {
      // Pequeno delay para a View do formulário aparecer antes de rolar
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 150);
    } else {
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#fff' }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} 
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          ref={scrollRef} // Conectando a referência ao ScrollView
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* SEÇÃO DA FOTO */}
          <View style={styles.card}>
            <Image 
              source={fotoLocal ? { uri: fotoLocal } : { uri: AVATAR_PADRAO }} 
              style={styles.fotoGrande} 
            />
            <Text style={styles.nome}>{dadosUsuario?.nome}</Text>
            <Text style={styles.emailTexto}>{dadosUsuario?.email}</Text>

            <TouchableOpacity style={styles.btnAcaoFoto} onPress={selecionarFoto}>
              <Text style={{ color: '#003366', fontWeight: 'bold', textDecorationLine: 'underline' }}>
                {fotoLocal ? "ALTERAR FOTO" : "INCLUIR FOTO"}
              </Text>
            </TouchableOpacity>

            {fotoLocal && !exibirEdicaoFoto && (
              <TouchableOpacity style={styles.btnVermelho} onPress={removerFoto}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>REMOVER FOTO</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* CONFIRMAÇÃO DE NOVA FOTO */}
          {exibirEdicaoFoto && (
            <View style={styles.areaEdicaoFoto}>
              <Text style={[styles.label, {color: '#2E7D32'}]}>Deseja salvar esta nova foto?</Text>
              <TouchableOpacity style={styles.btnConfirmar} onPress={salvarFotoNoBanco}>
                {carregando ? <ActivityIndicator color="#fff" /> : <Text style={{color: '#fff', fontWeight: 'bold'}}>CONFIRMAR FOTO</Text>}
              </TouchableOpacity>
            </View>
          )}

          {/* SEÇÃO DE SENHA */}
          <TouchableOpacity 
            style={[styles.btnMenu, {marginTop: 20}]} 
            onPress={toggleFormSenha}
          >
            <Text style={styles.btnMenuTexto}>{exibirFormSenha ? "CANCELAR ALTERAÇÃO" : "ALTERAR MINHA SENHA"}</Text>
          </TouchableOpacity>

          {exibirFormSenha && (
            <View style={styles.sessaoSenha}>
              <Text style={styles.label}>Senha Atual</Text>
              <TextInput 
                style={styles.inputSenha} 
                secureTextEntry 
                value={senhaAtual} 
                onChangeText={setSenhaAtual} 
                placeholder="Digite a senha atual" placeholderTextColor={INPUT.placeholder}
                onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
              />
              
              <Text style={styles.label}>Nova Senha</Text>
              <TextInput 
                style={styles.inputSenha} 
                secureTextEntry 
                value={novaSenha} 
                onChangeText={setNovaSenha} 
                placeholder="Mínimo 6 caracteres" placeholderTextColor={INPUT.placeholder}
                onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
              />
              
              <Text style={styles.label}>Confirmar Nova Senha</Text>
              <TextInput 
                style={styles.inputSenha} 
                secureTextEntry 
                value={confirmarSenha} 
                onChangeText={setConfirmarSenha} 
                placeholder="Repita a nova senha" placeholderTextColor={INPUT.placeholder}
                onFocus={() => scrollRef.current?.scrollToEnd({ animated: true })}
              />
              
              <TouchableOpacity style={styles.btnConfirmar} onPress={handleUpdateSenha} disabled={carregando}>
                {carregando ? <ActivityIndicator color="#fff" /> : <Text style={{color: '#fff', fontWeight: 'bold'}}>SALVAR NOVA SENHA</Text>}
              </TouchableOpacity>
            </View>
          )}
          
          {/* View de espaçamento extra para garantir que o scroll suba bastante */}
          <View style={{ height: 120 }} /> 
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}