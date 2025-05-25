import { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../historico/styles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { host } from '../../services/host';

type Registro = {
  id: string;
  tipoRefeicao: String;
  tipoFiltro: String;
  descricao: string;
  dataHora: string;
  valor: Number;
  periodo: String;
  totalCalorias: Number;
  totalCarboidratos: Number;
  totalGorduras: Number;
  totalProteinas: Number;

};

export const Historico = () => {
  const [filtro, setFiltro] = useState<'todos' | 'glicemia' | 'refeicao'>('todos');
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarRegistros = async (filtroAtual: 'todos' | 'glicemia' | 'refeicao') => {
    setCarregando(true);
    setErro(null);

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) throw new Error('ID do usuário não encontrado');

      let url = '';
      switch (filtroAtual) {
        case 'todos':
          url = `${host}:5000/api/historico/${userId}?tipo=todos`;
          break;
        case 'glicemia':
          url = `${host}:5000/api/historico/${userId}?tipo=glicemia`;
          break;
        case 'refeicao':
          url = `${host}:5000/api/historico/${userId}?tipo=refeicao`;
          break;
      }

      console.log('Requisição GET:', url);
      const response = await axios.get(url);
      const dados = response.data;

      const dadosMapeados = dados.map((item: any, index: number) => ({
        id: item._id ?? `sem-id-${index}`,
        tipoRefeicao: nomeRefeicaoAjustado(item.tipoRefeicao),
        tipoFiltro: item.tipoRefeicao ? 'Refeição' : 'Glicemia',
        dataHora: item.dataHora ? new Date(item.dataHora).toLocaleString('pt-BR') : 'Data inválida',
        valor: item.valor ?? "", 
        periodo: item.periodo ?? "",
        totalCalorias: item.totalCalorias ?? "",
        totalCarboidratos: item.totalCarboidratos ?? "",
        totalGorduras: item.totalGorduras ?? "",
        totalProteinas: item.totalProteinas ?? ""
      }));

      setRegistros(dadosMapeados);
    } catch (error) {
      console.error('Erro ao carregar registros:', error);
      setErro('Sem registros no momento.');
    } finally {
      setCarregando(false);
    }
  };

  const nomeRefeicaoAjustado = (nomeBanco: String) => {
    if(nomeBanco == "cafe"){ return "Café da manhã" }
    if(nomeBanco == "almoco"){ return "Almoço" }
    if(nomeBanco == "jantar"){ return "Jantar" }
    if(nomeBanco == "lanche"){ return "Lanche" }
  }

  // <condição> ? <Retorno Veradeiro> : <Retorno Falso> ; // Operador ternario

  useEffect(() => {
    carregarRegistros(filtro);
  }, [filtro]);

  return (
    <SafeAreaView style={styles.container1}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Histórico</Text>

        <View style={styles.filtrosContainer}>
          <TouchableOpacity onPress={() => setFiltro('todos')} style={styles.botaoFiltro}>
            <Text style={styles.textoBotaoFiltro}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFiltro('glicemia')} style={styles.botaoFiltro}>
            <Text style={styles.textoBotaoFiltro}>Glicemia</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFiltro('refeicao')} style={styles.botaoFiltro}>
            <Text style={styles.textoBotaoFiltro}>Refeição</Text>
          </TouchableOpacity>
        </View>

        {erro && <Text style={styles.erro}>{erro}</Text>}
        {carregando ? (
          <View style={styles.carregandoContainer}>
            <Text style={styles.carregandoTexto}>Carregando...</Text>
          </View>
        ) : (
          <FlatList
            data={registros}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemRegistro}>
                <Text style={styles.tipo}>{item.tipoFiltro}</Text>
                { item.periodo && <Text style={styles.valor}>{item.periodo}</Text> }
                { item.valor && <Text style={styles.data}>{item.valor.toString()} mg/dL</Text> }
                { item.tipoRefeicao && <Text style={styles.valor}>{item.tipoRefeicao}</Text> }
                { (item.totalCarboidratos && item.totalGorduras && item.totalProteinas && item.totalCalorias) && 
                <Text style={styles.data}>
                  {item.totalCarboidratos.toString()}g Carbs 
                  {"\n" + item.totalGorduras.toString()}g Gorduras
                  {"\n" + item.totalProteinas.toString()}g Proteínas
                  {"\n" + item.totalCalorias.toString()}kcal Calorias
                </Text> }
                <Text style={styles.data}>{item.dataHora}</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
