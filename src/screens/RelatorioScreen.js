import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { supabase } from '../services/supabase';
import { globalStyles as styles } from '../styles/globalStyles';

export default function RelatorioScreen() {
  const [viagensOriginal, setViagensOriginal] = useState([]); // Base de dados completa
  const [viagensFiltradas, setViagensFiltradas] = useState([]); // O que aparece na tela
  const [carregando, setCarregando] = useState(true);
  
  // Estados dos Filtros
  const [filtroTexto, setFiltroTexto] = useState('');

  useFocusEffect(
    useCallback(() => {
      buscarHistorico();
    }, [])
  );

  const buscarHistorico = async () => {
    setCarregando(true);
    // Busca somente viagens finalizadas (data_fim preenchida) na tabela movimentacoes
    const { data, error } = await supabase
      .from('movimentacoes')
      .select('*')
      .not('data_fim', 'is', null)
      .order('data_fim', { ascending: false });

    if (!error) {
      setViagensOriginal(data);
      setViagensFiltradas(data);
    }
    setCarregando(false);
  };

  // --- LÓGICA DE FILTRO EM TEMPO REAL ---
  const aplicarFiltro = (texto) => {
    setFiltroTexto(texto);
    const termo = texto.toLowerCase();

    const filtrados = viagensOriginal.filter(v =>
      v.motorista_nome?.toLowerCase().includes(termo) ||
      v.veiculo_placa?.toLowerCase().includes(termo) ||
      v.destino?.toLowerCase().includes(termo)
    );

    setViagensFiltradas(filtrados);
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return "-";
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR') + ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const gerarPDF = async () => {
    if (viagensFiltradas.length === 0) return Alert.alert("Aviso", "Não há dados filtrados para exportar.");

    const linhasTabela = viagensFiltradas.map(v => `
      <tr>
        <td>${v.motorista_nome || 'N/A'}</td>
        <td>${v.veiculo_placa || 'N/A'}</td>
        <td>${formatarData(v.data_inicio)}</td>
        <td>${formatarData(v.data_fim)}</td>
        <td>${v.km_inicial}</td>
        <td>${v.km_final}</td>
        <td>${v.km_final - v.km_inicial}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: 'Helvetica'; padding: 20px; }
            h1 { color: #003366; text-align: center; }
            .info { margin-bottom: 20px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th { background-color: #003366; color: white; padding: 10px; font-size: 10px; }
            td { border: 1px solid #ddd; padding: 8px; font-size: 9px; text-align: center; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Relatório de Atividades</h1>
          <div class="info">
            <p><strong>Filtro aplicado:</strong> ${filtroTexto || 'Todos os registros'}</p>
            <p><strong>Total de viagens:</strong> ${viagensFiltradas.length}</p>
            <p><strong>Data de geração:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Motorista</th>
                <th>Veículo</th>
                <th>Saída</th>
                <th>Chegada</th>
                <th>KM In.</th>
                <th>KM Fin.</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${linhasTabela}
            </tbody>
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (e) { Alert.alert("Erro", "Falha ao gerar PDF"); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f4f4' }}>
      {/* HEADER COM BOTÃO PDF */}
      <View style={{ backgroundColor: '#003366', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Relatórios</Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#28a745', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8, flexDirection: 'row', alignItems: 'center' }}
          onPress={gerarPDF}
        >
          <Ionicons name="file-tray-full-outline" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 5 }}>GERAR PDF</Text>
        </TouchableOpacity>
      </View>

      {/* BARRA DE FILTRO PESQUISA */}
      <View style={{ padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 10, paddingHorizontal: 10 }}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput 
            style={{ flex: 1, height: 45, marginLeft: 10 }}
            placeholder="Filtrar por motorista, placa ou carro..."
            value={filtroTexto}
            onChangeText={aplicarFiltro}
          />
          {filtroTexto !== '' && (
            <TouchableOpacity onPress={() => aplicarFiltro('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ fontSize: 12, color: '#666', marginTop: 8, marginLeft: 5 }}>
          Exibindo {viagensFiltradas.length} resultados
        </Text>
      </View>

      {carregando ? (
        <ActivityIndicator size="large" color="#003366" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={viagensFiltradas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { marginBottom: 12, borderLeftWidth: 5, borderLeftColor: '#003366' }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: 'bold', color: '#003366' }}>{item.veiculo_placa}</Text>
                <Text style={{ color: '#28a745', fontWeight: 'bold' }}>+{item.km_final - item.km_inicial} KM</Text>
              </View>

              <Text style={{ fontSize: 14, color: '#333', marginVertical: 5 }}>
                <Ionicons name="person-circle-outline" size={14} /> {item.motorista_nome}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8 }}>
                <View>
                  <Text style={{ fontSize: 10, color: '#999' }}>INÍCIO</Text>
                  <Text style={{ fontSize: 11 }}>{formatarData(item.data_inicio)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 10, color: '#999' }}>FIM</Text>
                  <Text style={{ fontSize: 11 }}>{formatarData(item.data_fim)}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}