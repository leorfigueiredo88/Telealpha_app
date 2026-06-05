import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { COLORS, INPUT } from '../../constants/theme';
import { supabase } from '../../services/supabase';
import { styles } from './MotoristaStyles';

export default function MotoristaScreen({ navigation, route }) {
  const usuarioLogado = route.params?.usuario;

  // Estados de Dados
  const [carregando, setCarregando] = useState(true);
  const [veiculos, setVeiculos] = useState([]);
  const [rotaAtiva, setRotaAtiva] = useState(null);
  const [evidenciasAtivas, setEvidenciasAtivas] = useState([]); 
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
  
  // Estados de Modais
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [modalSenhaVisivel, setModalSenhaVisivel] = useState(false);
  const [modalFotoPerfilVisivel, setModalFotoPerfilVisivel] = useState(false);
  const [modalChecklistVisivel, setModalChecklistVisivel] = useState(false);
  const [modalFinalizarVisivel, setModalFinalizarVisivel] = useState(false); 
  const [fotoTelaCheia, setFotoTelaCheia] = useState(null);

  // Estados de Perfil
  const [fotoPerfil, setFotoPerfil] = useState(usuarioLogado?.foto_url || null);
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Estados da Viagem
  const [kmInicial, setKmInicial] = useState('');
  const [destino, setDestino] = useState('');
  const [kmFinalInformado, setKmFinalInformado] = useState('');
  const [localChegada, setLocalChegada] = useState(''); 
  const [fotosChecklist, setFotosChecklist] = useState({
    'Frente': [], 'Traseira': [], 'Lado Direito': [], 'Lado Esquerdo': []
  });
  const [fotosUltimaViagem, setFotosUltimaViagem] = useState([]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const { data: vcl } = await supabase.from('veiculos').select('*').order('modelo');
      setVeiculos(vcl || []);
      
      const { data: mov } = await supabase.from('movimentacoes')
        .select(`*, veiculos!veiculo_placa (modelo)`)
        .is('data_fim', null)
        .eq('motorista_nome', usuarioLogado?.nome)
        .maybeSingle();

      if (mov) {
        setRotaAtiva(mov);
        const { data: evd } = await supabase.from('evidencias_movimentacao').select('*').eq('movimentacao_id', mov.id);
        setEvidenciasAtivas(evd || []);
      } else {
        setRotaAtiva(null);
        setEvidenciasAtivas([]);
      }
    } catch (error) { 
      console.error("Erro ao carregar:", error.message); 
    } finally { 
      setCarregando(false); 
    }
  };

  useFocusEffect(useCallback(() => { carregarDados(); }, []));

  // Funções de Perfil
  const trocarFotoPerfil = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Erro", "Acesso negado.");

    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) {
      setCarregando(true);
      const uri = result.assets[0].uri;
      const { error } = await supabase.from('usuarios').update({ foto_url: uri }).eq('id', usuarioLogado.id);
      if (!error) { setFotoPerfil(uri); setModalFotoPerfilVisivel(false); }
      setCarregando(false);
    }
  };

  const handleAlterarSenha = async () => {
    if (senhaAntiga !== usuarioLogado.senha) return Alert.alert("Erro", "Senha atual incorreta.");
    if (novaSenha !== confirmarSenha) return Alert.alert("Erro", "Senhas não coincidem.");
    setCarregando(true);
    const { error } = await supabase.from('usuarios').update({ senha: novaSenha }).eq('id', usuarioLogado.id);
    setCarregando(false);
    if (!error) { Alert.alert("Sucesso", "Senha alterada!"); setModalSenhaVisivel(false); }
  };

  // Funções de Viagem
  const tirarFotoChecklist = async (setor) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Erro", "Câmera negada.");
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.5 });
    if (!result.canceled) {
      setFotosChecklist(prev => ({ ...prev, [setor]: [...prev[setor], result.assets[0].uri] }));
    }
  };

  const abrirChecklist = async (veiculo) => {
    setCarregando(true);
    setVeiculoSelecionado(veiculo);
    setKmInicial(veiculo.km_atual.toString());
    setDestino('');
    setFotosChecklist({ 'Frente': [], 'Traseira': [], 'Lado Direito': [], 'Lado Esquerdo': [] });

    // Busca fotos de TODAS as viagens registradas para este veículo
    const { data: movimentos } = await supabase
      .from('movimentacoes')
      .select('id')
      .eq('veiculo_placa', veiculo.placa);

    if (movimentos && movimentos.length > 0) {
      const ids = movimentos.map(m => m.id);
      const { data: fotos } = await supabase
        .from('evidencias_movimentacao')
        .select('*')
        .in('movimentacao_id', ids)
        .order('created_at', { ascending: false });
      setFotosUltimaViagem(fotos || []);
    } else {
      setFotosUltimaViagem([]);
    }

    setCarregando(false);
    setModalChecklistVisivel(true);
  };

  const iniciarRota = async () => {
    if (!destino) return Alert.alert("Atenção", "Informe o destino.");
    setCarregando(true);
    try {
      const { data: novaMov, error: errMov } = await supabase.from('movimentacoes').insert([{
        veiculo_placa: veiculoSelecionado.placa,
        data_inicio: new Date().toISOString(),
        km_inicial: Number(kmInicial),
        motorista_nome: usuarioLogado?.nome,
        destino: destino
      }]).select().single();

      if (errMov) throw errMov;

      const arrayFotos = [];
      Object.keys(fotosChecklist).forEach(setor => {
        fotosChecklist[setor].forEach(uri => {
          arrayFotos.push({ movimentacao_id: novaMov.id, setor: setor, foto_url: uri });
        });
      });

      if (arrayFotos.length > 0) await supabase.from('evidencias_movimentacao').insert(arrayFotos);

      setRotaAtiva(novaMov);
      setModalChecklistVisivel(false);
      await carregarDados();
    } catch (error) { Alert.alert("Erro", error.message); setCarregando(false); }
  };

  const finalizarViagemDB = async () => {
    if (!kmFinalInformado) return Alert.alert("Atenção", "Informe o KM final.");
    setCarregando(true);
    try {
      await supabase.from('movimentacoes').update({ 
        data_fim: new Date().toISOString(), km_final: Number(kmFinalInformado), local_chegada: localChegada 
      }).eq('id', rotaAtiva.id);
      await supabase.from('veiculos').update({ km_atual: Number(kmFinalInformado) }).eq('placa', rotaAtiva.veiculo_placa);
      setModalFinalizarVisivel(false);
      await carregarDados();
    } catch (error) { Alert.alert("Erro", error.message); } finally { setCarregando(false); }
  };

  if (carregando) return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisivel(true)}><Ionicons name="menu" size={30} color={COLORS.primary} /></TouchableOpacity>
        <Text style={styles.saudacao}>Olá, {usuarioLogado?.nome.split(' ')[0]}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {rotaAtiva ? (
          <View style={styles.containerViagemFocada}>
             <View style={styles.cardViagemAtivaFocada}>
                <Ionicons name="car-sport" size={80} color="white" />
                <Text style={styles.txtViagemModelo}>{rotaAtiva.veiculos?.modelo}</Text>
                <Text style={styles.txtViagemPlaca}>{rotaAtiva.veiculo_placa}</Text>
                <View style={styles.badgeRota}><Text style={styles.badgeTexto}>EM TRÂNSITO</Text></View>
             </View>
             <TouchableOpacity style={styles.btnEncerrarGrande} onPress={() => setModalFinalizarVisivel(true)}>
                <Ionicons name="stop-circle" size={26} color="white" />
                <Text style={styles.btnTextoEncerrar}>FINALIZAR VIAGEM</Text>
             </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.secaoTitulo}>VEÍCULOS DISPONÍVEIS</Text>
            {veiculos.map((v) => (
              <TouchableOpacity key={v.id} style={[styles.veiculoCard, veiculoSelecionado?.placa === v.placa && styles.veiculoSelecionado]} onPress={() => setVeiculoSelecionado(v)}>
                <Ionicons name="car-sport" size={24} color={COLORS.primary} />
                <View style={styles.veiculoInfo}><Text style={styles.veiculoModelo}>{v.modelo}</Text><Text style={styles.veiculoPlaca}>{v.placa}</Text></View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.btnIniciar, !veiculoSelecionado && styles.btnDesabilitado]} onPress={() => veiculoSelecionado && abrirChecklist(veiculoSelecionado)}>
              <Text style={styles.btnTexto}>INICIAR NOVA VIAGEM</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* MODAL CHECKLIST (FOCO NA CORREÇÃO DAS FOTOS) */}
      <Modal visible={modalChecklistVisivel} animationType="slide">
        <View style={styles.modalChecklistContainer}>
          <Text style={styles.modalTituloChecklist}>Check-list de Partida</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formViagem}>
              <Text style={styles.labelInput}>KM Inicial</Text>
              <TextInput style={styles.inputViagem} value={kmInicial} editable={false} placeholderTextColor={INPUT.placeholder} />
              <Text style={styles.labelInput}>Local de Saída</Text>
              <TextInput style={styles.inputViagem} value={destino} onChangeText={setDestino} placeholder="Ex: Matriz, Av. Paulista, Depósito..." placeholderTextColor={INPUT.placeholder} />
            </View>

            {Object.keys(fotosChecklist).map((setor) => {
              const refSetor = fotosUltimaViagem.filter(f => f.setor === setor);
              const novasSetor = fotosChecklist[setor];
              return (
                <View key={setor} style={styles.itemChecklist}>
                  <View style={styles.rowChecklistMain}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.labelSetor}>{setor}</Text>
                      {refSetor.length > 0 && (
                        <Text style={{ fontSize: 10, color: '#999' }}>
                          {refSetor.length} foto{refSetor.length > 1 ? 's' : ''} anterior{refSetor.length > 1 ? 'es' : ''}
                        </Text>
                      )}
                    </View>

                    <View style={styles.containerFotosECamera}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollFotosInterno}>
                        {/* Fotos registradas anteriormente (todas as viagens) — borda cinza */}
                        {refSetor.map((f, idx) => (
                          <TouchableOpacity key={`ref-${idx}`} onPress={() => setFotoTelaCheia(f.foto_url)}>
                            <Image source={{ uri: f.foto_url }} style={[styles.boxFotoMiniChecklist, styles.fotoAnterior]} />
                          </TouchableOpacity>
                        ))}
                        {/* Fotos novas desta viagem — borda azul */}
                        {novasSetor.map((uri, idx) => (
                          <TouchableOpacity key={`nova-${idx}`} onPress={() => setFotoTelaCheia(uri)}>
                            <Image source={{ uri }} style={[styles.boxFotoMiniChecklist, styles.fotoNova]} />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <TouchableOpacity style={styles.btnCameraPequena} onPress={() => tirarFotoChecklist(setor)}>
                        <Ionicons name="camera" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

            <TouchableOpacity style={styles.btnConfirmarIniciar} onPress={iniciarRota}><Text style={styles.btnTexto}>INICIAR ROTA</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setModalChecklistVisivel(false)} style={styles.btnVoltarChecklist}><Text style={styles.btnVoltarTexto}>Voltar</Text></TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* MENU LATERAL */}
      <Modal visible={menuVisivel} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuVisivel(false)}>
          <View style={styles.menuLateral}>
            <View style={styles.menuHeader}>
              <TouchableOpacity
                style={styles.containerAvatar}
                onPress={() => fotoPerfil && setFotoTelaCheia(fotoPerfil)}
                activeOpacity={fotoPerfil ? 0.7 : 1}
              >
                {fotoPerfil
                  ? <Image source={{ uri: fotoPerfil }} style={styles.fotoPerfil} />
                  : <Ionicons name="person" size={50} color="#CCC" />}
              </TouchableOpacity>
              <Text style={styles.menuNome}>{usuarioLogado?.nome}</Text>
            </View>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisivel(false); setModalFotoPerfilVisivel(true); }}>
              <Ionicons name="person-outline" size={22} color={COLORS.primary} /><Text style={styles.menuItemTexto}>Perfil / Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisivel(false); setModalSenhaVisivel(true); }}>
              <Ionicons name="lock-closed-outline" size={22} color={COLORS.primary} /><Text style={styles.menuItemTexto}>Alterar Senha</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItemSair} onPress={() => navigation.replace('Login')}>
              <Ionicons name="log-out-outline" size={22} color={COLORS.accent} /><Text style={styles.menuItemTextoSair}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* OUTROS MODAIS */}
      <Modal visible={modalFotoPerfilVisivel} transparent><View style={styles.modalOverlayCenter}><View style={styles.modalCardCustom}><Text style={styles.modalTitulo}>Sua Foto</Text><TouchableOpacity style={styles.btnConfirmarIniciar} onPress={trocarFotoPerfil}><Text style={styles.btnTexto}>GALERIA</Text></TouchableOpacity><TouchableOpacity onPress={() => setModalFotoPerfilVisivel(false)}><Text style={styles.btnFecharTexto}>Fechar</Text></TouchableOpacity></View></View></Modal>
      <Modal visible={modalSenhaVisivel} transparent><View style={styles.modalOverlayCenter}><View style={styles.modalCardCustom}><Text style={styles.modalTitulo}>Alterar Senha</Text><TextInput style={styles.inputViagemCustom} placeholder="Senha atual" placeholderTextColor={INPUT.placeholder} secureTextEntry value={senhaAntiga} onChangeText={setSenhaAntiga} /><TextInput style={styles.inputViagemCustom} placeholder="Nova senha" placeholderTextColor={INPUT.placeholder} secureTextEntry value={novaSenha} onChangeText={setNovaSenha} /><TextInput style={styles.inputViagemCustom} placeholder="Confirme a nova senha" placeholderTextColor={INPUT.placeholder} secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} /><TouchableOpacity style={styles.btnConfirmarIniciar} onPress={handleAlterarSenha}><Text style={styles.btnTexto}>SALVAR</Text></TouchableOpacity><TouchableOpacity onPress={() => setModalSenhaVisivel(false)}><Text style={styles.btnFecharTexto}>Cancelar</Text></TouchableOpacity></View></View></Modal>
      <Modal visible={!!fotoTelaCheia} transparent><View style={styles.fullImageContainer}><TouchableOpacity style={styles.btnCloseFull} onPress={() => setFotoTelaCheia(null)}><Ionicons name="close-circle" size={40} color="white" /></TouchableOpacity><Image source={{ uri: fotoTelaCheia }} style={styles.fullImage} resizeMode="contain" /></View></Modal>
      <Modal visible={modalFinalizarVisivel} transparent><View style={styles.modalOverlayCenter}><View style={styles.modalCardCustom}><Text style={styles.modalTitulo}>Finalizar Viagem</Text><TextInput style={styles.inputViagemCustom} placeholder="KM Final" placeholderTextColor={INPUT.placeholder} keyboardType="numeric" value={kmFinalInformado} onChangeText={setKmFinalInformado} /><TextInput style={styles.inputViagemCustom} placeholder="Local de chegada" placeholderTextColor={INPUT.placeholder} value={localChegada} onChangeText={setLocalChegada} /><TouchableOpacity style={styles.btnConfirmarIniciar} onPress={finalizarViagemDB}><Text style={styles.btnTexto}>CONCLUIR</Text></TouchableOpacity><TouchableOpacity onPress={() => setModalFinalizarVisivel(false)}><Text style={styles.btnFecharTexto}>Voltar</Text></TouchableOpacity></View></View></Modal>
    </View>
  );
}