import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { Text, View, FlatList, TouchableOpacity, TextInput, SafeAreaView } from "react-native";
import { styles } from "../refeicoes/styles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { host } from '../../services/host';
import { SelectList } from "react-native-dropdown-select-list";

interface Alimento {
  id: string;
  nome: string;
  carboidrato1g: number;
  proteina1g: number;
  gordura1g: number;
  caloria1g: number;
}

export const TelaRefeicoes: React.FC = () => {
  const [tipoRefeicao, setTipoRefeicao] = useState('cafe');
  const [totalCarboidratos, setTotalCarboidratos] = useState(0);
  const [totalProteinas, setTotalProteinas] = useState(0);
  const [totalGorduras, setTotalGorduras] = useState(0);
  const [totalCalorias, setTotalCalorias] = useState(0);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});
  const [searchTerm, setSearchTerm] = useState('');

const buscarAlimentos = async (termo: string) => {
  if (!termo) return;
  try {
    const resp = await fetch(`${host}:5000/alimentos?nome=${encodeURIComponent(termo)}`);
    const data = await resp.json();
    const foods: Alimento[] = data.map((item: any) => ({
      id: item._id.toString(),
      nome: item.nome,
      carboidrato1g: item.carboidrato1g,
      proteina1g: item.proteina1g,
      gordura1g: item.gordura1g,
      caloria1g: item.caloria1g,
    }));
    setAlimentos(foods);
  } catch (e) {
    console.error("Erro ao buscar alimentos:", e);
  }
};

  const handleGramasChange = (item: Alimento, gramas: string) => {
    const g = parseFloat(gramas) || 0;

    const proporcao = g / 100;

    const newQuantities = {
      ...quantities,
      [item.id]: g,
    };
    setQuantities(newQuantities);

    let totalC = 0, totalP = 0, totalG = 0, totalK = 0;

    alimentos.forEach(alimento => {
      const gramasAlimento = newQuantities[alimento.id] || 0;
      totalC += alimento.carboidrato1g * gramasAlimento;
      totalP += alimento.proteina1g * gramasAlimento;
      totalG += alimento.gordura1g * gramasAlimento;
      totalK += alimento.caloria1g * gramasAlimento;
    });

    setTotalCarboidratos(parseFloat(totalC.toFixed(2)));
    setTotalProteinas(parseFloat(totalP.toFixed(2)));
    setTotalGorduras(parseFloat(totalG.toFixed(2)));
    setTotalCalorias(parseFloat(totalK.toFixed(2)));
  };

  const salvarRefeicao = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const alimentosComGramas = alimentos
      .filter(alimento => quantities[alimento.id])
      .map(alimento => ({
        id: alimento.id,
        nome: alimento.nome,
        gramas: quantities[alimento.id],
        carboidratos: alimento.carboidrato1g * quantities[alimento.id],
        proteinas: alimento.proteina1g * quantities[alimento.id],
        gorduras: alimento.gordura1g * quantities[alimento.id],
        calorias: alimento.caloria1g * quantities[alimento.id],
      }));

    const novaRefeicao = {
      tipoRefeicao,
      alimentos: alimentosComGramas,
      totalCarboidratos,
      totalProteinas,
      totalGorduras,
      totalCalorias,
      dataHora: new Date().toISOString(),
      userId,
    };

    if (!userId) {
      alert('Usuário não encontrado.');
      return;
    }
    if (alimentosComGramas.length === 0) {
      alert('Selecione pelo menos um alimento.');
      return;
    }

    console.log('Enviando para o backend:', novaRefeicao);

    try {
      await axios.post(`${host}:5000/api/refeicoes`, novaRefeicao, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Refeição salva com sucesso!');
      setAlimentos([]);
      setQuantities({});
      setSearchTerm('');
      setTotalCarboidratos(0);
      setTotalProteinas(0);
      setTotalGorduras(0);
      setTotalCalorias(0);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error('Erro Axios:', err.response?.data);
        alert(`Erro: ${err.response?.data?.message || 'Erro inesperado.'}`);
      } else {
        alert('Erro inesperado ao salvar a refeição.');
      }
    }
  };

  const tiposRefeicoesList = [
    { key: "cafe" , value: "Café da Manhã" },
    { key: "almoco" , value: "Almoço" },
    { key: "jantar" , value: "Jantar" },
    { key: "lanche" , value: "Lanche" },
  ];

  return (
    <SafeAreaView style={styles.container1}>
      <View style={styles.container}>
        <Text style={styles.title}>Selecione o Tipo de Refeição</Text>
        <SelectList
          setSelected={setTipoRefeicao}
          data={tiposRefeicoesList}
          save="value"
          placeholder="Tipo da Refeição"
          boxStyles={styles.input}
          inputStyles={styles.selectListInput}
          dropdownStyles={{ borderWidth: 0 }}
          dropdownTextStyles={styles.selectListDropdown}
          search={false}
        />

        <Text style={styles.title}>Pesquise por um Alimento</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do alimento"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={() => buscarAlimentos(searchTerm)}
        />

        <Text style={styles.title}>Alimentos Encontrados</Text>
        <FlatList
          data={alimentos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.itemName}>{item.nome}</Text>
                <Text style={{ color: '#6B7280', marginTop: 4, fontSize: 14 }}>
                {`Carb: ${item.carboidrato1g}g/g • Prot: ${item.proteina1g}g/g • Gord: ${item.gordura1g}g/g • Cal: ${item.caloria1g} kcal/g`}
                </Text>
                <TextInput
                  style={[styles.input, { marginTop: 8 }]}
                  placeholder="Quantidade (g)"
                  keyboardType="numeric"
                  value={quantities[item.id]?.toString() || ''}
                  onChangeText={text => handleGramasChange(item, text)}
                />
              </View>
            </View>
          )}
        />

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.summaryIcon}>🍞</Text>
            <Text style={styles.summaryValue}>{totalCarboidratos.toFixed(1)}g</Text>
            <Text style={styles.summaryLabel}>Carboidratos</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.summaryIcon}>🍗</Text>
            <Text style={styles.summaryValue}>{totalProteinas.toFixed(1)}g</Text>
            <Text style={styles.summaryLabel}>Proteínas</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.summaryIcon}>🧈</Text>
            <Text style={styles.summaryValue}>{totalGorduras.toFixed(1)}g</Text>
            <Text style={styles.summaryLabel}>Gorduras</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: '#FCE4EC' }]}>
            <Text style={styles.summaryIcon}>🔥</Text>
            <Text style={styles.summaryValue}>{totalCalorias.toFixed(1)} kcal</Text>
            <Text style={styles.summaryLabel}>Calorias</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={salvarRefeicao}>
          <Text style={styles.textoBotaoSalvar}>Salvar Refeição</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
