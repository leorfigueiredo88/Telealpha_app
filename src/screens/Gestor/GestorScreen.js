import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { INPUT } from '../../constants/theme';
import { supabase } from '../../services/supabase';
import { s } from './GestorStyles';

export default function GestorScreen({ navigation, route }) {
  const usuarioLogado = route.params?.usuario;
  const [abaAtiva, setAbaAtiva] = useState('veiculos');
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  // Modais
  const [modalVisivel, setModalVisivel] = useState(false); // Modal de Cadastro/Edição
  const [modalDetalheVisivel, setModalDetalheVisivel] = useState(false); // Modal de Relatório
  const [itemSelecionado, setItemSelecionado] = useState(null); // Para o Relatório
  const [itemSendoEditado, setItemSendoEditado] = useState(null); // Para o CRUD

  const [busca, setBusca] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [itensSelecionados, setItensSelecionados] = useState(new Set());
  const [gerandoPDF, setGerandoPDF] = useState(false);

  // Estados para formulário (CRUD)
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [kmAtual, setKmAtual] = useState('');

  // ESTADO DO "OLHINHO" (CORREÇÃO: Agora dentro da função)
  const [exibirSenhaCadastro, setExibirSenhaCadastro] = useState(false);

  // Estados do Menu Lateral
  const [menuVisivel, setMenuVisivel] = useState(false);
  const [modalFotoPerfilVisivel, setModalFotoPerfilVisivel] = useState(false);
  const [modalSenhaVisivel, setModalSenhaVisivel] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState(usuarioLogado?.foto_url || null);
  const [fotoTelaCheia, setFotoTelaCheia] = useState(null);
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Estados da galeria de fotos de veículos
  const [modalFotosVeiculoVisivel, setModalFotosVeiculoVisivel] = useState(false);
  const [fotosVeiculo, setFotosVeiculo] = useState([]);
  const [veiculoSelecionadoFotos, setVeiculoSelecionadoFotos] = useState(null);

  const abrirFotosVeiculo = async (veiculo) => {
    setVeiculoSelecionadoFotos(veiculo);
    const { data: movs } = await supabase.from('movimentacoes').select('id').eq('veiculo_placa', veiculo.placa);
    if (movs && movs.length > 0) {
      const ids = movs.map(m => m.id);
      const { data: fotos } = await supabase
        .from('evidencias_movimentacao')
        .select('*')
        .in('movimentacao_id', ids)
        .order('created_at', { ascending: false });
      setFotosVeiculo(fotos || []);
    } else {
      setFotosVeiculo([]);
    }
    setModalFotosVeiculoVisivel(true);
  };

  const excluirFotoVeiculo = (fotoId) => {
    Alert.alert("Confirmar", "Excluir esta foto permanentemente?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
        await supabase.from('evidencias_movimentacao').delete().eq('id', fotoId);
        setFotosVeiculo(prev => prev.filter(f => f.id !== fotoId));
      }}
    ]);
  };

  const trocarFotoPerfil = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return Alert.alert("Erro", "Acesso à galeria negado.");
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.5 });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const { error } = await supabase.from('usuarios').update({ foto_url: uri }).eq('id', usuarioLogado.id);
      if (!error) { setFotoPerfil(uri); setModalFotoPerfilVisivel(false); }
    }
  };

  const handleAlterarSenha = async () => {
    if (senhaAntiga !== usuarioLogado.senha) return Alert.alert("Erro", "Senha atual incorreta.");
    if (novaSenha !== confirmarSenha) return Alert.alert("Erro", "As novas senhas não coincidem.");
    if (novaSenha.length < 6) return Alert.alert("Aviso", "A nova senha deve ter no mínimo 6 caracteres.");
    const { error } = await supabase.from('usuarios').update({ senha: novaSenha }).eq('id', usuarioLogado.id);
    if (!error) {
      Alert.alert("Sucesso", "Senha alterada!");
      setModalSenhaVisivel(false);
      setSenhaAntiga(''); setNovaSenha(''); setConfirmarSenha('');
    }
  };

  useEffect(() => {
    setBusca('');
    setDataInicio('');
    setDataFim('');
    setItensSelecionados(new Set());
  }, [abaAtiva]);

  useFocusEffect(
    useCallback(() => {
      buscarDados();
    }, [abaAtiva])
  );

  const buscarDados = async () => {
    setCarregando(true);
    let query;

    if (abaAtiva === 'veiculos') {
      query = supabase.from('veiculos').select('*').order('modelo');
    } else if (abaAtiva === 'motoristas') {
      query = supabase.from('usuarios').select('*').eq('perfil', 'motorista').order('nome');
    } else {
      query = supabase.from('movimentacoes').select('*').order('data_inicio', { ascending: false });
    }

    const { data, error } = await query;
    if (error) console.error("Erro Supabase:", error.message);
    else setDados(data || []);
    setCarregando(false);
  };

  const salvarCadastro = async () => {
    try {
      const tabela = abaAtiva === 'veiculos' ? 'veiculos' : 'usuarios';
      const payload = abaAtiva === 'veiculos' 
        ? { modelo, placa, km_atual: Number(kmAtual) } 
        : { nome, email, senha, perfil: 'motorista' };

      let res;
      if (itemSendoEditado) {
        res = await supabase.from(tabela).update(payload).eq('id', itemSendoEditado.id);
      } else {
        res = await supabase.from(tabela).insert([payload]);
      }

      if (res.error) throw res.error;

      Alert.alert("Sucesso", "Dados salvos com sucesso!");
      fecharModalCadastro();
      buscarDados();
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  const excluirItem = (id) => {
    Alert.alert("Confirmar", "Deseja excluir este registro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
          const tabela = abaAtiva === 'veiculos' ? 'veiculos' : 'usuarios';
          await supabase.from(tabela).delete().eq('id', id);
          buscarDados();
      }}
    ]);
  };

  const abrirEdicao = (item) => {
    setItemSendoEditado(item);
    if (abaAtiva === 'veiculos') {
      setModelo(item.modelo);
      setPlaca(item.placa);
      setKmAtual(item.km_atual?.toString());
    } else {
      setNome(item.nome);
      setEmail(item.email);
      setSenha(item.senha);
    }
    setModalVisivel(true);
  };

  const fecharModalCadastro = () => {
    setModalVisivel(false);
    setItemSendoEditado(null);
    setExibirSenhaCadastro(false); // Reseta o olho ao fechar
    setNome(''); setEmail(''); setSenha('');
    setModelo(''); setPlaca(''); setKmAtual('');
  };

  const mascaraData = (text) => {
    const c = text.replace(/\D/g, '');
    if (c.length <= 2) return c;
    if (c.length <= 4) return c.substring(0, 2) + '/' + c.substring(2);
    return c.substring(0, 2) + '/' + c.substring(2, 4) + '/' + c.substring(4, 8);
  };

  const toggleSelecionar = (id) => {
    setItensSelecionados(prev => {
      const novo = new Set(prev);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  };

  const selecionarTodos = () => {
    if (itensSelecionados.size === dadosFiltrados.length && dadosFiltrados.length > 0) {
      setItensSelecionados(new Set());
    } else {
      setItensSelecionados(new Set(dadosFiltrados.map(i => i.id)));
    }
  };

  const gerarPDFPeriodo = async () => {
    const selecionados = dadosFiltrados.filter(item => itensSelecionados.has(item.id));
    if (selecionados.length === 0) return Alert.alert("Atenção", "Selecione ao menos um relatório.");

    setGerandoPDF(true);
    try {
      const linhas = selecionados.map(item => `
        <tr>
          <td>${item.motorista_nome}</td>
          <td>${item.veiculo_placa}</td>
          <td>${item.destino || '-'}</td>
          <td>${formatarDataHora(item.data_inicio)}</td>
          <td>${item.local_chegada || 'Em curso'}</td>
          <td>${item.data_fim ? formatarDataHora(item.data_fim) : '-'}</td>
          <td>${item.km_inicial}</td>
          <td>${item.km_final || '-'}</td>
          <td>${item.km_final ? (item.km_final - item.km_inicial) + ' KM' : '-'}</td>
        </tr>
      `).join('');

      const periodoLabel = (dataInicio || dataFim)
        ? `${dataInicio || 'início'} até ${dataFim || 'atual'}`
        : 'Todos os registros';

      const html = `
        <html><head><style>
          body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
          h1 { color: #003366; text-align: center; margin-bottom: 4px; }
          .sub { text-align: center; color: #666; font-size: 11px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th { background: #003366; color: white; padding: 8px 5px; font-size: 8px; text-align: left; }
          td { border: 1px solid #ddd; padding: 5px 4px; font-size: 8px; }
          tr:nth-child(even) { background: #f5f5f5; }
          .rodape { margin-top: 20px; font-size: 10px; color: #999; text-align: right; }
        </style></head>
        <body>
          <h1>Relatório de Rotas — Telealpha</h1>
          <p class="sub">Período: ${periodoLabel} &nbsp;|&nbsp; Total: ${selecionados.length} viagem(ns)</p>
          <table>
            <thead><tr>
              <th>Motorista</th>
              <th>Veículo</th>
              <th>Local de Saída</th>
              <th>Data/Hora Saída</th>
              <th>Local de Chegada</th>
              <th>Data/Hora Chegada</th>
              <th>KM Ini.</th>
              <th>KM Fin.</th>
              <th>KM Total</th>
            </tr></thead>
            <tbody>${linhas}</tbody>
          </table>
          <p class="rodape">Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
        </body></html>
      `;

      const periodoNome = (dataInicio || dataFim)
        ? `${(dataInicio || '').replace(/\//g, '-')}_a_${(dataFim || '').replace(/\//g, '-')}`
        : 'Completo';
      const nomeArquivoPeriodo = `Relatorio_${periodoNome}`;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: `${nomeArquivoPeriodo}.pdf`, UTI: 'com.adobe.pdf' });
    } catch (e) {
      Alert.alert("Erro", "Falha ao gerar o PDF.");
    } finally {
      setGerandoPDF(false);
    }
  };

  const formatarDataHora = (dataIso) => {
    if (!dataIso) return "-";
    const d = new Date(dataIso);
    return d.toLocaleDateString('pt-BR') + " às " + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const gerarPDFIndividual = async (item) => {
    const dataSimples = new Date(item.data_inicio).toLocaleDateString('pt-BR').replace(/\//g, '-');
    const nomeMotorista = item.motorista_nome.replace(/\s+/g, '_');
    const nomeArquivo = `Relatorio_${nomeMotorista}_${dataSimples}`;

    const html = `
      <html><body style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #003366; text-align: center;">Relatório de Rota</h1>
        <p style="text-align: center; color: #666; font-size: 12px; margin-bottom: 20px;">Telealpha — ${dataSimples}</p>
        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 10px;">
          <p><strong>Motorista:</strong> ${item.motorista_nome}</p>
          <p><strong>Veículo:</strong> ${item.veiculo_placa}</p>
          <hr>
          <p><strong>Local de Saída:</strong> ${item.destino || '-'}</p>
          <p><strong>Data/Hora Saída:</strong> ${formatarDataHora(item.data_inicio)}</p>
          <hr>
          <p><strong>Local de Chegada:</strong> ${item.local_chegada || 'Em curso'}</p>
          <p><strong>Data/Hora Chegada:</strong> ${item.data_fim ? formatarDataHora(item.data_fim) : 'Aguardando finalização'}</p>
          <hr>
          <p><strong>KM Inicial:</strong> ${item.km_inicial} KM</p>
          <p><strong>KM Final:</strong> ${item.km_final || 'Pendente'} KM</p>
          <p><strong>KM Total Percorrido:</strong> ${item.km_final ? item.km_final - item.km_inicial : '0'} KM</p>
        </div>
      </body></html>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: `${nomeArquivo}.pdf`,
      UTI: 'com.adobe.pdf'
    });
  };

  const dadosFiltrados = dados.filter(item => {
    const termo = busca.toLowerCase().trim();
    if (abaAtiva === 'relatorios') {
      const nomeMot = item.motorista_nome?.toLowerCase() || "";
      const placaVei = item.veiculo_placa?.toLowerCase() || "";
      const passaTexto = termo === "" || nomeMot.includes(termo) || placaVei.includes(termo);

      const dataItem = item.data_inicio ? new Date(item.data_inicio) : null;
      let passaInicio = true;
      let passaFim = true;
      if (dataInicio.length === 10) {
        const [d, m, y] = dataInicio.split('/');
        passaInicio = dataItem >= new Date(`${y}-${m}-${d}T00:00:00`);
      }
      if (dataFim.length === 10) {
        const [d, m, y] = dataFim.split('/');
        passaFim = dataItem <= new Date(`${y}-${m}-${d}T23:59:59`);
      }
      return passaTexto && passaInicio && passaFim;
    }
    const principal = (item.nome || item.modelo || "").toLowerCase();
    const secundario = (item.placa || item.email || "").toLowerCase();
    return principal.includes(termo) || secundario.includes(termo);
  });

  const cadastrarNovoRapido = (aba) => {
    setAbaAtiva(aba);
    setModalVisivel(true);
  };

  return (
    <View style={s.container}>
      {/* Header com menu hamburguer */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, marginTop: 20 }}>
        <TouchableOpacity onPress={() => setMenuVisivel(true)}>
          <Ionicons name="menu" size={30} color="#003366" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#003366' }}>
          Olá, {usuarioLogado?.nome?.split(' ')[0] || 'Gestor'}
        </Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={s.menuGrid}>
        <View style={s.row}>
          <TouchableOpacity style={[s.cardMenu, abaAtiva === 'veiculos' && s.cardAtivo]} onPress={() => setAbaAtiva('veiculos')}>
            <TouchableOpacity style={{ position: 'absolute', top: 8, right: 8 }} onPress={() => cadastrarNovoRapido('veiculos')}>
              <Ionicons name="add-circle" size={22} color={abaAtiva === 'veiculos' ? '#fff' : '#003366'} />
            </TouchableOpacity>
            <Ionicons name="car-sport" size={24} color={abaAtiva === 'veiculos' ? '#fff' : '#003366'} />
            <Text style={[s.cardTitulo, abaAtiva === 'veiculos' && { color: '#fff' }]}>Veículos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[s.cardMenu, abaAtiva === 'motoristas' && s.cardAtivo]} onPress={() => setAbaAtiva('motoristas')}>
            <TouchableOpacity style={{ position: 'absolute', top: 8, right: 8 }} onPress={() => cadastrarNovoRapido('motoristas')}>
              <Ionicons name="add-circle" size={22} color={abaAtiva === 'motoristas' ? '#fff' : '#003366'} />
            </TouchableOpacity>
            <Ionicons name="people" size={24} color={abaAtiva === 'motoristas' ? '#fff' : '#003366'} />
            <Text style={[s.cardTitulo, abaAtiva === 'motoristas' && { color: '#fff' }]}>Motoristas</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[s.cardRelatorio, abaAtiva === 'relatorios' && s.cardAtivo]} onPress={() => setAbaAtiva('relatorios')}>
          <Ionicons name="document-text" size={24} color={abaAtiva === 'relatorios' ? '#fff' : '#003366'} />
          <Text style={[s.cardTitulo, { marginLeft: 10 }, abaAtiva === 'relatorios' && { color: '#fff' }]}>Relatórios de Rotas</Text>
        </TouchableOpacity>
      </View>

      <View style={s.buscaContainer}>
        <Ionicons name="search" size={18} color="#999" />
        <TextInput placeholder="Pesquisar..." placeholderTextColor={INPUT.placeholder} style={{ flex: 1, marginLeft: 10, color: '#1A1A2E' }} value={busca} onChangeText={setBusca} />
      </View>

      {abaAtiva === 'relatorios' && (
        <>
          {/* Filtro por período */}
          <View style={s.row}>
            <View style={[s.buscaContainer, { flex: 1, marginRight: 6 }]}>
              <Ionicons name="calendar-outline" size={15} color="#999" />
              <TextInput
                placeholder="De: DD/MM/AAAA"
                placeholderTextColor={INPUT.placeholder}
                style={{ flex: 1, marginLeft: 6, fontSize: 13, color: '#1A1A2E' }}
                value={dataInicio}
                onChangeText={t => setDataInicio(mascaraData(t))}
                maxLength={10}
                keyboardType="numeric"
              />
            </View>
            <View style={[s.buscaContainer, { flex: 1 }]}>
              <Ionicons name="calendar-outline" size={15} color="#999" />
              <TextInput
                placeholder="Até: DD/MM/AAAA"
                placeholderTextColor={INPUT.placeholder}
                style={{ flex: 1, marginLeft: 6, fontSize: 13, color: '#1A1A2E' }}
                value={dataFim}
                onChangeText={t => setDataFim(mascaraData(t))}
                maxLength={10}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Barra de seleção */}
          <View style={s.barraSelecao}>
            <TouchableOpacity onPress={selecionarTodos} style={s.btnSelecionarTodos}>
              <Ionicons
                name={itensSelecionados.size === dadosFiltrados.length && dadosFiltrados.length > 0 ? "checkbox" : "square-outline"}
                size={20} color="#003366"
              />
              <Text style={s.txtSelecionarTodos}>
                {itensSelecionados.size === dadosFiltrados.length && dadosFiltrados.length > 0
                  ? 'Desmarcar todos'
                  : 'Selecionar todos'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.btnGerarPDF, itensSelecionados.size === 0 && { opacity: 0.4 }]}
              onPress={gerarPDFPeriodo}
              disabled={itensSelecionados.size === 0 || gerandoPDF}
            >
              {gerandoPDF
                ? <ActivityIndicator size="small" color="#fff" />
                : <>
                    <Ionicons name="document-text-outline" size={16} color="#fff" />
                    <Text style={s.txtGerarPDF}>PDF ({itensSelecionados.size})</Text>
                  </>
              }
            </TouchableOpacity>
          </View>
        </>
      )}

      {carregando ? <ActivityIndicator size="large" color="#003366" /> : (
        <FlatList
          data={dadosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.itemLista, abaAtiva === 'relatorios' && itensSelecionados.has(item.id) && s.itemSelecionado]}
              onPress={() => {
                if (abaAtiva === 'relatorios') toggleSelecionar(item.id);
              }}
              onLongPress={() => {
                if (abaAtiva === 'relatorios') { setItemSelecionado(item); setModalDetalheVisivel(true); }
              }}
            >
              {abaAtiva === 'relatorios' && (
                <Ionicons
                  name={itensSelecionados.has(item.id) ? "checkbox" : "square-outline"}
                  size={22} color="#003366"
                  style={{ marginRight: 12 }}
                />
              )}

              <View style={{ flex: 1 }}>
                <Text style={s.itemNome}>{abaAtiva === 'relatorios' ? item.motorista_nome : (item.modelo || item.nome)}</Text>
                <Text style={s.itemDetalhe}>
                  {abaAtiva === 'relatorios' ? `Placa: ${item.veiculo_placa} | Saída: ${item.destino || '-'}` : (item.placa || item.email)}
                </Text>
                {abaAtiva === 'relatorios' && (
                   <View style={{ marginTop: 5 }}>
                     <Text style={{ fontSize: 11, color: '#28a745' }}>🏁 Chegada: {item.local_chegada || 'Em curso...'}</Text>
                     <Text style={{ fontSize: 10, color: '#999' }}>📅 {formatarDataHora(item.data_inicio)}</Text>
                   </View>
                )}
              </View>

              {abaAtiva !== 'relatorios' && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {abaAtiva === 'veiculos' && (
                    <TouchableOpacity onPress={() => abrirFotosVeiculo(item)} style={{ marginRight: 15 }}>
                      <Ionicons name="images-outline" size={22} color="#2A9D8F" />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => abrirEdicao(item)} style={{ marginRight: 15 }}>
                    <Ionicons name="create-outline" size={22} color="#003366" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => excluirItem(item.id)}>
                    <Ionicons name="trash-outline" size={22} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              )}
              {abaAtiva === 'relatorios' && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
            </TouchableOpacity>
          )}
        />
      )}

      {abaAtiva !== 'relatorios' && (
        <TouchableOpacity style={s.btnFlutuante} onPress={() => setModalVisivel(true)}>
          <Ionicons name="add" size={35} color="#fff" />
        </TouchableOpacity>
      )}

      <Modal visible={modalVisivel} animationType="fade" transparent={true}>
        <View style={s.modalOverlay}>
          <View style={s.modalForm}>
            <Text style={s.modalTitulo}>{itemSendoEditado ? 'Editar' : 'Novo'} {abaAtiva === 'veiculos' ? 'Veículo' : 'Motorista'}</Text>
            {abaAtiva === 'veiculos' ? (
              <>
                <TextInput placeholder="Modelo" placeholderTextColor={INPUT.placeholder} style={s.input} value={modelo} onChangeText={setModelo} />
                <TextInput placeholder="Placa" placeholderTextColor={INPUT.placeholder} style={s.input} value={placa} onChangeText={setPlaca} />
                <TextInput placeholder="KM Inicial" placeholderTextColor={INPUT.placeholder} style={s.input} value={kmAtual} onChangeText={setKmAtual} keyboardType="numeric" />
              </>
            ) : (
              <>
                <TextInput placeholder="Nome" placeholderTextColor={INPUT.placeholder} style={s.input} value={nome} onChangeText={setNome} />
                <TextInput placeholder="E-mail" placeholderTextColor={INPUT.placeholder} style={s.input} value={email} onChangeText={setEmail} />
                
                {/* CAMPO DE SENHA COM OLHINHO */}
                <View style={s.inputSenhaContainer}>
                  <TextInput
                    placeholder="Senha"
                    placeholderTextColor={INPUT.placeholder}
                    style={{ flex: 1, height: '100%', paddingHorizontal: 15, color: '#1A1A2E' }}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!exibirSenhaCadastro}
                  />
                  <TouchableOpacity onPress={() => setExibirSenhaCadastro(!exibirSenhaCadastro)} style={{ paddingHorizontal: 12 }}>
                    <Ionicons name={exibirSenhaCadastro ? "eye-off-outline" : "eye-outline"} size={18} color="#003366" />
                  </TouchableOpacity>
                </View>
              </>
            )}
            <TouchableOpacity style={s.btnSalvar} onPress={salvarCadastro}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>SALVAR</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={fecharModalCadastro} style={{ marginTop: 15, alignItems: 'center' }}>
              <Text style={{ color: '#666' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={modalDetalheVisivel} animationType="slide" transparent={true}>
        <View style={s.modalOverlay}>
          <View style={s.modalConteudo}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitulo}>Detalhes da Rota</Text>
              <TouchableOpacity onPress={() => setModalDetalheVisivel(false)}>
                <Ionicons name="close-circle" size={32} color="#999" />
              </TouchableOpacity>
            </View>
            {itemSelecionado && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={s.label}>MOTORISTA / VEÍCULO</Text>
                <Text style={s.valor}>{itemSelecionado.motorista_nome} - {itemSelecionado.veiculo_placa}</Text>
                
                <View style={{ marginTop: 15 }}>
                  <Text style={s.label}>LOCAL DE SAÍDA</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="exit-outline" size={16} color="#003366" />
                    <Text style={s.valor}> {itemSelecionado.destino || '-'}</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#003366', marginLeft: 20 }}>{formatarDataHora(itemSelecionado.data_inicio)}</Text>
                </View>

                <View style={{ marginTop: 15 }}>
                  <Text style={s.label}>LOCAL DE CHEGADA</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="enter-outline" size={16} color={itemSelecionado.data_fim ? "#28a745" : "#999"} />
                    <Text style={[s.valor, !itemSelecionado.data_fim && { color: '#999' }]}>
                      {itemSelecionado.local_chegada || 'Ainda em curso...'}
                    </Text>
                  </View>
                  {itemSelecionado.data_fim ? (
                    <Text style={{ fontSize: 13, color: '#003366', marginLeft: 20 }}>{formatarDataHora(itemSelecionado.data_fim)}</Text>
                  ) : (
                    <Text style={{ fontSize: 13, color: '#999', marginLeft: 20 }}>Aguardando finalização</Text>
                  )}
                </View>

                <View style={s.kmDestaque}>
                  <Text style={{color: '#fff', fontSize: 12}}>TOTAL PERCORRIDO</Text>
                  <Text style={{color: '#fff', fontSize: 24, fontWeight: 'bold'}}>
                    {itemSelecionado.km_final ? (itemSelecionado.km_final - itemSelecionado.km_inicial) : '0'} KM
                  </Text>
                </View>

                <TouchableOpacity style={s.btnPdfModal} onPress={() => gerarPDFIndividual(itemSelecionado)}>
                  <Ionicons name="download" size={20} color="#fff" />
                  <Text style={{color: '#fff', fontWeight: 'bold', marginLeft: 10}}>Baixar Relatório PDF</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
      {/* MENU LATERAL */}
      <Modal visible={menuVisivel} transparent animationType="fade">
        <TouchableOpacity style={s.menuOverlay} activeOpacity={1} onPress={() => setMenuVisivel(false)}>
          <View style={s.menuLateral}>
            <View style={s.menuHeader}>
                <TouchableOpacity
                style={s.containerAvatar}
                onPress={() => fotoPerfil && setFotoTelaCheia(fotoPerfil)}
                activeOpacity={fotoPerfil ? 0.7 : 1}
              >
                {fotoPerfil
                  ? <Image source={{ uri: fotoPerfil }} style={s.fotoPerfil} />
                  : <Ionicons name="person" size={50} color="#CCC" />}
              </TouchableOpacity>
              <Text style={s.menuNome}>{usuarioLogado?.nome}</Text>
              <Text style={{ fontSize: 12, color: '#999' }}>{usuarioLogado?.email}</Text>
            </View>

            <TouchableOpacity style={s.menuItem} onPress={() => { setMenuVisivel(false); setModalFotoPerfilVisivel(true); }}>
              <Ionicons name="person-outline" size={22} color="#003366" />
              <Text style={s.menuItemTexto}>Perfil / Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.menuItem} onPress={() => { setMenuVisivel(false); setModalSenhaVisivel(true); }}>
              <Ionicons name="lock-closed-outline" size={22} color="#003366" />
              <Text style={s.menuItemTexto}>Alterar Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity style={s.menuItemSair} onPress={() => navigation.replace('Login')}>
              <Ionicons name="log-out-outline" size={22} color="#E63946" />
              <Text style={s.menuItemTextoSair}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL FOTO DE PERFIL */}
      <Modal visible={modalFotoPerfilVisivel} transparent animationType="fade">
        <View style={s.modalOverlayCentro}>
          <View style={s.modalCardPerfil}>
            <Text style={s.modalTitulo}>Sua Foto</Text>
            {fotoPerfil && (
              <Image source={{ uri: fotoPerfil }} style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 15 }} />
            )}
            <TouchableOpacity style={s.btnSalvar} onPress={trocarFotoPerfil}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>ESCOLHER DA GALERIA</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalFotoPerfilVisivel(false)} style={{ marginTop: 15, alignItems: 'center' }}>
              <Text style={{ color: '#666' }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* GALERIA DE FOTOS DO VEÍCULO — exclusão pelo gestor */}
      <Modal visible={modalFotosVeiculoVisivel} animationType="slide" transparent={true}>
        <View style={s.modalOverlay}>
          <View style={[s.modalConteudo, { height: '88%' }]}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitulo}>Fotos — {veiculoSelecionadoFotos?.modelo} ({veiculoSelecionadoFotos?.placa})</Text>
              <TouchableOpacity onPress={() => setModalFotosVeiculoVisivel(false)}>
                <Ionicons name="close-circle" size={32} color="#999" />
              </TouchableOpacity>
            </View>

            {fotosVeiculo.length === 0 ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="images-outline" size={60} color="#DDD" />
                <Text style={{ color: '#999', marginTop: 10 }}>Nenhuma foto registrada para este veículo</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {['Frente', 'Traseira', 'Lado Direito', 'Lado Esquerdo'].map(setor => {
                  const fotosSetor = fotosVeiculo.filter(f => f.setor === setor);
                  if (fotosSetor.length === 0) return null;
                  return (
                    <View key={setor} style={{ marginBottom: 20 }}>
                      <Text style={s.label}>{setor} ({fotosSetor.length})</Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {fotosSetor.map((foto) => (
                          <View key={foto.id} style={s.wrapperFotoGaleria}>
                            <TouchableOpacity onPress={() => setFotoTelaCheia(foto.foto_url)}>
                              <Image source={{ uri: foto.foto_url }} style={s.fotoGaleriaGestor} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={s.btnExcluirFoto}
                              onPress={() => excluirFotoVeiculo(foto.id)}
                            >
                              <Ionicons name="close-circle" size={22} color="#E63946" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* FOTO EM TELA CHEIA */}
      <Modal visible={!!fotoTelaCheia} transparent>
        <View style={s.fullImageContainer}>
          <TouchableOpacity style={s.btnCloseFull} onPress={() => setFotoTelaCheia(null)}>
            <Ionicons name="close-circle" size={40} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: fotoTelaCheia }} style={s.fullImage} resizeMode="contain" />
        </View>
      </Modal>

      {/* MODAL ALTERAR SENHA */}
      <Modal visible={modalSenhaVisivel} transparent animationType="fade">
        <View style={s.modalOverlayCentro}>
          <View style={s.modalCardPerfil}>
            <Text style={s.modalTitulo}>Alterar Senha</Text>
            <TextInput style={s.input} placeholder="Senha atual" placeholderTextColor={INPUT.placeholder} secureTextEntry value={senhaAntiga} onChangeText={setSenhaAntiga} />
            <TextInput style={s.input} placeholder="Nova senha" placeholderTextColor={INPUT.placeholder} secureTextEntry value={novaSenha} onChangeText={setNovaSenha} />
            <TextInput style={s.input} placeholder="Confirmar nova senha" placeholderTextColor={INPUT.placeholder} secureTextEntry value={confirmarSenha} onChangeText={setConfirmarSenha} />
            <TouchableOpacity style={s.btnSalvar} onPress={handleAlterarSenha}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>SALVAR NOVA SENHA</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setModalSenhaVisivel(false); setSenhaAntiga(''); setNovaSenha(''); setConfirmarSenha(''); }} style={{ marginTop: 15, alignItems: 'center' }}>
              <Text style={{ color: '#666' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}
