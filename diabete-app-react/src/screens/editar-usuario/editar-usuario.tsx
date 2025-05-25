import { useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../editar-usuario/styles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { host } from '../../services/host';
import { SelectList } from 'react-native-dropdown-select-list';

export const EditarUsuario = () => {
  const [modoEdicao, setModoEdicao] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'dados' | 'saude'>('dados');

  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState(0);
  const [genero, setGenero] = useState("");
  const [altura, setAltura] = useState(0);
  const [peso, setPeso] = useState(0);
  const [tipoDiabetes, setTipoDiabetes] = useState("");
  const [metaGlicemia, setMetaGlicemia] = useState(0);

  const dataGenero = [
    { key: "1", value: "Feminino" },
    { key: "2", value: "Masculino" },
    { key: "3", value: "Outros" },
    { key: "4", value: "Prefiro não informar" }
  ];
  const dataDiabetes = [
    { key: '1', value: 'Tipo 1' },
    { key: '2', value: 'Tipo 2' },
    { key: '3', value: 'Gestacional' },
    { key: '4', value: 'Pré-diabetes' },
    { key: '5', value: 'Outro' }
  ];

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          Alert.alert("Erro", "Usuário não encontrado.");
        }
        const response = await axios.get(`${host}:5000/api/users/${userId}`);
        const usuario = response.data;
        setNome(usuario.nome || "");
        setIdade(usuario.idade || "");
        setGenero(usuario.sexo || "");
        setAltura(usuario.altura || "");
        setPeso(usuario.peso || "");
        setTipoDiabetes(usuario.tipoDiabetes || "");
        setMetaGlicemia(usuario.metaGlicemia || "");
      } catch (error) {
        if (axios.isAxiosError(error)) {
            alert(`Erro: ${error.response?.data?.message || 'Erro inesperado.'}`);
        } else{
          Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
        }
      }
    };
    carregarDados();
  }, []);

  const ativarEdicao = () => setModoEdicao(true);
  const salvarAlteracoes = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      await axios.put(`${host}:5000/api/users/${userId}`, {
        nome,
        idade,
        sexo: genero,
        altura,
        peso,
        tipoDiabetes,
        metaGlicemia,
      });
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      setModoEdicao(false);
      router.replace("/(stacks)/editar-usuario");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };
  const converterParaNumero = (textoNumerico:String, funcaoSet:any) => {
    const onlyNumbers = Number(textoNumerico.replace(/[^0-9]/g, ''));
    funcaoSet(onlyNumbers);
  }

  return (
    <SafeAreaView style={styles.container1}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Meu perfil</Text>
        <View style={styles.abasContainer}>
          <TouchableOpacity
            style={[styles.aba, abaAtiva === 'dados' ? styles.abaAtiva : styles.abaInativa]}
            onPress={() => setAbaAtiva('dados')}
          >
            <Text style={styles.textoAba}>Meus Dados</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.aba, abaAtiva === 'saude' ? styles.abaAtiva : styles.abaInativa]}
            onPress={() => setAbaAtiva('saude')}
          >
            <Text style={styles.textoAba}>Dados de Saúde</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          {abaAtiva === 'dados' && (
            <View style={styles.linha}>
              <View style={styles.coluna}>
                <Text style={styles.label}>📝 Nome</Text>
                <TextInput
                  style={styles.input}
                  value={nome}
                  onChangeText={setNome}
                  editable={modoEdicao}
                  placeholder="Nome"
                />
                <Text style={styles.label}>🎂 Idade</Text>
                <TextInput
                  style={styles.input}
                  value={String(idade)}
                  onChangeText={v => converterParaNumero(v, setIdade)}
                  editable={modoEdicao}
                  placeholder="Idade"
                  keyboardType="numeric"
                />
                <Text style={styles.label}>⚧️ Gênero</Text>
                <SelectList
                  setSelected={setGenero}
                  data={dataGenero}
                  save="value"
                  placeholder="Gênero"
                  boxStyles={styles.input}
                  inputStyles={{ color: '#22304A', fontSize: 20 }}
                  dropdownStyles={{ borderWidth: 0 }}
                  dropdownTextStyles={{ color: '#22304A', fontSize: 18 }}
                  search={false}
                />
              </View>
              <View style={styles.coluna} />
            </View>
          )}
          {abaAtiva === 'saude' && (
            <View>
              <Text style={styles.label}>📏 Altura (cm)</Text>
              <TextInput
                style={styles.input}
                value={String(altura)}
                onChangeText={v => converterParaNumero(v, setAltura)}
                editable={modoEdicao}
                placeholder="Altura (cm)"
                keyboardType="numeric"
              />
              <Text style={styles.label}>⚖️ Peso (kg)</Text>
              <TextInput
                style={styles.input}
                value={String(peso)}
                onChangeText={v => converterParaNumero(v, setPeso)}
                editable={modoEdicao}
                placeholder="Peso (kg)"
                keyboardType="numeric"
              />
              <Text style={styles.label}>🩺 Tipo de Diabetes</Text>
              <SelectList
                setSelected={setTipoDiabetes}
                data={dataDiabetes}
                save="value"
                placeholder="Tipo de Diabetes"
                boxStyles={styles.input}
                inputStyles={{ color: '#22304A', fontSize: 20 }}
                dropdownStyles={{ borderWidth: 0 }}
                dropdownTextStyles={{ color: '#22304A', fontSize: 18 }}
                search={false}
              />
              <Text style={styles.label}>🎯 Meta de Glicemia</Text>
              <TextInput
                style={styles.input}
                value={String(metaGlicemia)}
                onChangeText={v => converterParaNumero(v, setMetaGlicemia)}
                editable={modoEdicao}
                placeholder="Meta de Glicemia"
                keyboardType="numeric"
              />
            </View>
          )}
          {!modoEdicao ? (
            <TouchableOpacity style={styles.botaoEditar} onPress={ativarEdicao}>
              <Text style={styles.textoBotao}>Editar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.botaoSalvar} onPress={salvarAlteracoes}>
              <Text style={styles.textoBotao}>Salvar Alterações</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};