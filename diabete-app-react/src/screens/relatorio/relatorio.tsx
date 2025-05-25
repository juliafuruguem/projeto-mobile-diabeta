//import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, Platform, ScrollView, SafeAreaView } from 'react-native';
import { styles } from './styles'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { host } from '@/src/services/host';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const calcularMedia = (array: number[]) =>
  array.length > 0 ? (array.reduce((a, b) => a + b, 0) / array.length).toFixed(1) : '0';

function converterParaISO(data: string) {
  const partes = data.split('/');
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
  }
  return data;
}

const getPeriodo = (opcao: string, inicioPersonalizado: string, fimPersonalizado: string) => {
  const hoje = new Date();
  let inicio, fim;

  switch (opcao) {
    case 'Última Semana':
      inicio = new Date(hoje);
      inicio.setDate(hoje.getDate() - 7);
      fim = hoje;
      break;
    case 'Último Mês':
      inicio = new Date(hoje);
      inicio.setMonth(hoje.getMonth() - 1);
      fim = hoje;
      break;
    case 'Personalizar':
      if (!inicioPersonalizado || !fimPersonalizado) {
        throw new Error('Por favor, selecione as datas de início e fim');
      }
      inicio = new Date(converterParaISO(inicioPersonalizado));
      fim = new Date(converterParaISO(fimPersonalizado));
      if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
        throw new Error('Datas inválidas. Use o formato DD/MM/AAAA');
      }
      break;
    default:
      throw new Error('Opção de período inválida');
  }

  return {
    inicio: inicio.toISOString().split('T')[0],
    fim: fim.toISOString().split('T')[0],
  };
};

export const TelaExportacao = () => {
  const [mediaGlicemia, setMediaGlicemia] = useState('0');
  const [mediaCarboidratos, setMediaCarboidratos] = useState('0');
  const [registrosAltos, setRegistrosAltos] = useState(0);
  const [registrosBaixos, setRegistrosBaixos] = useState(0);
  const [periodo, setPeriodo] = useState('Última Semana');
  const [inicioPersonalizado, setInicioPersonalizado] = useState('');
  const [fimPersonalizado, setFimPersonalizado] = useState('');
  const [registros, setRegistros] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [dadosProntos, setDadosProntos] = useState(false);
  const [usuario, setUsuario] = useState<any>(null);

  const buscarDados = async () => {
    setCarregando(true);
    setDadosProntos(false);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return alert('Usuário não encontrado');

      const { inicio, fim } = getPeriodo(periodo, inicioPersonalizado, fimPersonalizado);

      const [glicemiaResp, refeicoesResp, historicoResp] = await Promise.all([
        axios.get(`${host}:5000/api/glicemia/${userId}?inicio=${inicio}&fim=${fim}`),
        axios.get(`${host}:5000/api/refeicoes/${userId}?inicio=${inicio}&fim=${fim}`),
        axios.get(`${host}:5000/api/historico/${userId}?tipo=todos&inicio=${inicio}&fim=${fim}`)
      ]);

      const glicemias = glicemiaResp.data || [];
      const refeicoes = refeicoesResp.data || [];
      const historico = historicoResp.data || [];

      const valoresGlicemia = glicemias.map((item: any) => item.valor);
      const mediaG = calcularMedia(valoresGlicemia);
      setMediaGlicemia(mediaG);

      const altos = valoresGlicemia.filter((val: number) => val > 180).length;
      const baixos = valoresGlicemia.filter((val: number) => val < 70).length;
      setRegistrosAltos(altos);
      setRegistrosBaixos(baixos);

      const valoresCarbo = refeicoes
        .map((item: any) => item.carboidratos ?? item.totalCarboidratos)
        .filter((v: any) => typeof v === 'number' && !isNaN(v));
      const mediaC = calcularMedia(valoresCarbo);
      setMediaCarboidratos(mediaC);

      const registrosOrdenados = historico.sort((a: any, b: any) => 
        new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
      );
      setRegistros(registrosOrdenados);
      setDadosProntos(true);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      alert('Erro ao buscar dados.');
    } finally {
      setCarregando(false);
    }
  };

  const handlePeriodo = (opcao: string) => {
    setPeriodo(opcao);
    if (opcao !== 'Personalizar') {
      setInicioPersonalizado('');
      setFimPersonalizado('');
      buscarDados();
    }
  };

  useEffect(() => {
    if (
      periodo === 'Personalizar' &&
      inicioPersonalizado.length === 10 &&
      fimPersonalizado.length === 10
    ) {
      buscarDados();
    }
  }, [inicioPersonalizado, fimPersonalizado]);

  useEffect(() => {
    const buscarUsuario = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;
      try {
        const resp = await axios.get(`${host}:5000/api/users/${userId}`);
        setUsuario(resp.data);
      } catch (e) {
        setUsuario(null);
      }
    };
    buscarUsuario();
  }, []);

  const gerarRelatorioPDF = async () => {
    try {
      const registrosGlicemia = registros.filter(r => !r.tipoRefeicao && r.valor);
      const registrosRefeicao = registros.filter(r => r.tipoRefeicao);

      const usuarioHTML = usuario ? `
        <div class="usuario-info" style="margin-bottom: 10px;">
          <h3>Meus dados:</h3>
          <p><strong>Nome:</strong> ${usuario.nome || '-'}</p>
          <p><strong>Idade:</strong> ${usuario.idade || '-'}</p>
          <p><strong>Sexo:</strong> ${usuario.sexo || '-'}</p>
          <p><strong>Altura:</strong> ${usuario.altura ? usuario.altura + ' cm' : '-'}</p>
          <p><strong>Peso:</strong> ${usuario.peso ? usuario.peso + ' kg' : '-'}</p>
        </div>
      ` : '';

      if (Platform.OS === 'web') {
        const glicemiaHTML = registrosGlicemia.map(registro => `
          <tr>
            <td>${registro.valor ? registro.valor + ' mg/dL' : '-'}</td>
            <td>${registro.periodo || '-'}</td>
            <td>${new Date(registro.dataHora).toLocaleString('pt-BR')}</td>
          </tr>
        `).join('');

        const refeicaoHTML = registrosRefeicao.map(registro => `
          <tr>
            <td>${registro.tipoRefeicao || '-'}</td>
            <td>${registro.totalCarboidratos ? registro.totalCarboidratos + 'g' : '-'}</td>
            <td>${registro.totalCalorias ? registro.totalCalorias + ' kcal' : '-'}</td>
            <td>${new Date(registro.dataHora).toLocaleString('pt-BR')}</td>
          </tr>
        `).join('');

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          throw new Error('Não foi possível abrir a janela de impressão');
        }

        printWindow.document.write(`
          <html>
            <head>
              <title>Relatório de Glicemia</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
                h1 { color: #333; text-align: center; }
                .usuario-info { background: #f0f4fa; padding: 16px; border-radius: 8px; margin-bottom: 18px; }
                .summary { background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                .summary p { margin: 5px 0; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                @media print {
                  body { padding: 0; }
                  .summary, th { background-color: #f5f5f5 !important; -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body>
              <div class="content">
                <h1>Relatório de Glicemia</h1>
                ${usuarioHTML}
                <div class="summary">
                  <h2>Resumo do Período</h2>
                  <p><strong>Período:</strong> ${periodo}</p>
                  <p><strong>Média Glicemia:</strong> ${mediaGlicemia} mg/dL</p>
                  <p><strong>Média Carboidratos:</strong> ${mediaCarboidratos}g</p>
                  <p><strong>Registros Altos:</strong> ${registrosAltos}</p>
                  <p><strong>Registros Baixos:</strong> ${registrosBaixos}</p>
                </div>

                <h2>Registros de Glicemia</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Valor</th>
                      <th>Período</th>
                      <th>Data/Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${glicemiaHTML}
                  </tbody>
                </table>

              <h2>Registros de Refeição</h2>
              <table>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Carboidratos</th>
                    <th>Calorias</th>
                    <th>Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  ${refeicaoHTML}
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `);
        printWindow.document.close();
        printWindow.print();
      } else {
        // HTML completo para PDF no mobile
        const html = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .usuario-info, .summary { margin-bottom: 20px; }
                .summary p { margin: 5px 0; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
              </style>
            </head>
            <body>
              <h1>Relatório de Glicemia</h1>
              ${usuarioHTML}
              <div class="summary">
                <h2>Resumo do Período</h2>
                <p><strong>Período:</strong> ${periodo}</p>
                <p><strong>Média Glicemia:</strong> ${mediaGlicemia} mg/dL</p>
                <p><strong>Média Carboidratos:</strong> ${mediaCarboidratos}g</p>
                <p><strong>Registros Altos:</strong> ${registrosAltos}</p>
                <p><strong>Registros Baixos:</strong> ${registrosBaixos}</p>
              </div>
              <h2>Registros de Glicemia</h2>
              <table>
                <thead>
                  <tr>
                    <th>Valor</th>
                    <th>Período</th>
                    <th>Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  ${registrosGlicemia.map(registro => `
                    <tr>
                      <td>${registro.valor} mg/dL</td>
                      <td>${registro.periodo || '-'}</td>
                      <td>${new Date(registro.dataHora).toLocaleString('pt-BR')}</td>
                    </tr>`).join('')}
                </tbody>
              </table>
              <h2>Registros de Refeição</h2>
              <table>
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Carboidratos</th>
                    <th>Calorias</th>
                    <th>Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  ${registrosRefeicao.map(registro => `
                    <tr>
                      <td>${registro.tipoRefeicao || '-'}</td>
                      <td>${registro.totalCarboidratos || '-'}g</td>
                      <td>${registro.totalCalorias || '-'} kcal</td>
                      <td>${new Date(registro.dataHora).toLocaleString('pt-BR')}</td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </body>
          </html>
        `;

        const { uri } = await Print.printToFileAsync({ html });

        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o relatório PDF.');
    }
  };
  return (
    <SafeAreaView style={styles.container1}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.titulo}>Exportar Relatório</Text>
        <View style={styles.card}>
          <Text style={styles.subtitulo}>Escolha o período:</Text>

          <View style={styles.botoesPeriodo}>
            {['Última Semana', 'Último Mês', 'Personalizar'].map((opcao) => (
              <TouchableOpacity
                key={opcao}
                style={styles.botaoPeriodo}
                onPress={() => handlePeriodo(opcao)}
              >
                <Text style={styles.textoBotao}>{opcao}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {periodo === 'Personalizar' && (
            <View style={styles.formularioPersonalizado}>
              <Text style={{marginBottom: 2, marginLeft: 2}}>Data Inicial</Text>
              <TextInput
                style={styles.inputData}
                placeholder="Data Início (DD/MM/AAAA)"
                value={inicioPersonalizado}
                onChangeText={setInicioPersonalizado}
              />
              <Text style={{marginBottom: 2, marginLeft: 2, marginTop: 8}}>Data Final</Text>
              <TextInput
                style={styles.inputData}
                placeholder="Data Fim (DD/MM/AAAA)"
                value={fimPersonalizado}
                onChangeText={setFimPersonalizado}
              />
            </View>
          )}

          <View style={styles.resumoContainer}>
            <Text style={styles.resumoTitulo}>Resumo</Text>
            <Text style={styles.itemResumo}>Média Glicemia: {mediaGlicemia} mg/dL</Text>
            <Text style={styles.itemResumo}>Média Carboidratos: {isNaN(Number(mediaCarboidratos)) ? '0' : mediaCarboidratos}g</Text>
            <Text style={styles.itemResumo}>Registros Altos: {registrosAltos}</Text>
            <Text style={styles.itemResumo}>Registros Baixos: {registrosBaixos}</Text>
          </View>

          {carregando && <Text style={{margin: 10, color: '#888', textAlign: 'center'}}>Carregando dados...</Text>}

          <TouchableOpacity
            style={[styles.botaoExportar, !dadosProntos || carregando ? styles.botaoExportarDisabled : {}, !dadosProntos || carregando ? { opacity: 0.7 } : {}]}
            onPress={gerarRelatorioPDF}
            disabled={!dadosProntos || carregando}
          >
            <Text style={styles.textoBotao2}>Exportar PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
