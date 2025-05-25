import { useState } from "react";
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from "../registro/styles";
import axios from "axios"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { host } from '../../services/host';

export const TelaRegistro = () => {
  const [glicemia, setGlicemia] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [dataHora, setDataHora] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const [glicemiaSalva, setGlicemiaSalva] = useState<number | null>(null);
  const [glicemiaStatus, setGlicemiaStatus] = useState('');

  const salvarRegistro = async () => {
    const valor = parseInt(glicemia.trim());
    const userId = await AsyncStorage.getItem('userId');
    
    console.log("Valor glicemia:", valor); 
    
    if (isNaN(valor) || glicemia === '' || !userId) {
      Alert.alert('Erro', 'Por favor, insira um valor válido para a glicemia.');
    } else {
      const novoRegistro = {
        valor,
        periodo,
        dataHora: dataHora.toISOString(),
        userId: userId,
      };

      try {
        const response = await axios.post(`${host}:5000/api/glicemia`, novoRegistro);

        console.log(response);
        
        if (response.status >= 200 && response.status < 300) {
          let emoji = '☺️ Normal:\nÓtimo trabalho! Glicemia dentro do ideal. Mantenha os bons cuidados!';
          if (valor < 70) {
            emoji = '⚠️ Alerta:\nSua glicemia baixou um pouquinho. Vamos cuidar disso?';
          } else if (valor > 150) {
            emoji = '⚠️ Alerta:\nOps! A glicemia passou do ideal. Vamos dar uma olhadinha nisso agora?';
          }

          Alert.alert(
            'Sucesso',
            `Glicemia registrada com sucesso!\n\nValor: ${valor} mg/dL\nPeríodo: ${periodo}\n${emoji}`
          );

          setGlicemia(''); 
          setGlicemiaSalva(valor); 
          setGlicemiaStatus(emoji); 
        }
      } catch (error) {
        console.error('Erro Axios:', error);
        if (axios.isAxiosError(error)) {
          alert(`Erro: ${error.response?.data?.message || 'Erro inesperado.'}`);
        } else {
          alert('Erro inesperado ao cadastrar usuário.');
        }
      }
    }
  };

  const dataPeriodo = [
    { key: '1', value: 'Jejum' },
    { key: '2', value: 'Antes do café' },
    { key: '3', value: 'Antes das refeições' },
    { key: '4', value: 'Depois das refeições' },
    { key: '5', value: 'Dormir' },
    { key: '6', value: 'Outro' }
  ];

  return (
    <SafeAreaView style={styles.container1}>
    <View style={styles.container}>
      <Text style={styles.tituloCardRegistro}>Registro manual da glicemia</Text>
      <Text style={styles.title}>🩸 Valor da Glicemia (mg/dL)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={glicemia}
        onChangeText={setGlicemia}
        placeholder="Ex: 110"
      />

      <Text style={styles.title}>Período</Text>
      <View style={styles.pickerContainer}>
        <SelectList
          setSelected={setPeriodo}
          data={dataPeriodo}
          save="value"
          placeholder="Selecione o período"
          boxStyles={{ 
            backgroundColor: 'transparent',
            borderWidth: 0, 
            borderColor: 'transparent',
            paddingVertical: 12,
            paddingHorizontal: 10
          }}
          inputStyles={{ color: 'rgba(16, 47, 80, 0.88)', fontSize: 18 }}
          dropdownStyles={{ borderWidth: 0, marginTop: 0 }}
          dropdownTextStyles={{ color: 'rgba(16, 47, 80, 0.62)', fontSize: 18 }}
          search={false}
        />
      </View>

      <Text style={styles.title}>Data e Hora</Text>
      <TouchableOpacity onPress={() => setMostrarPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>{dataHora.toLocaleString()}</Text>
      </TouchableOpacity>

      {mostrarPicker && (
        <DateTimePicker
          value={dataHora}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setMostrarPicker(false);
            if (selectedDate) setDataHora(selectedDate);
          }}
        />
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.salvarBotao} onPress={salvarRegistro}>
          <Text style={styles.textoBotao}>Salvar Registro</Text>
        </TouchableOpacity>
      </View>

      {glicemiaSalva !== null && (
        <View style={styles.cardGlicemia}>
          <Text style={styles.cardValor}>{glicemiaSalva} mg/dL</Text>
          <Text style={styles.cardTexto}>{glicemiaStatus}</Text>
        </View>
      )}
    </View>
    </SafeAreaView>
  );
};
