import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { styles } from '../perfil/stytes';
import { useState } from 'react';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { host } from '../../services/host';

export const PerfilUsuario = () => {
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [sexo, setSexo] = useState('');
    const [altura, setAltura] = useState('');
    const [peso, setPeso] = useState('');
    const [tipoDiabetes, setTipoDiabetes] = useState('');
    const [metaGlicemia, setMetaGlicemia] = useState('');

    const salvarUserId = async (userId: string) => {
        try {
          await AsyncStorage.setItem('userId', userId);
          console.log("UserId salvo com sucesso.");
        } catch (e) {
          console.error('Erro ao salvar o userId no AsyncStorage', e);
        }
      };

    const salvarPerfil = async () => {
        const userData = {
          nome,
          idade,
          sexo,
          altura,
          peso,
          tipoDiabetes,
          metaGlicemia,
        };
        
        try {
            console.log(userData);
            const response = await axios.post(`${host}:5000/api/users`, userData);
            const usuarioIdSalvo = response.data.userId;
            console.log('Usuário cadastrado com sucesso', response.data);

            await salvarUserId(usuarioIdSalvo);

            router.navigate('/(stacks)/home');

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Erro Axios:', {
                    mensagemDeErro: error.message,
                    statusDoErro: error.response?.status,
                    dadosDeRetorno: error.response?.data,
                });

                alert(`Erro: ${error.response?.data?.message || 'Erro inesperado.'}`);
            } else {
                console.error('Erro desconhecido:', error);
                alert('Erro inesperado ao cadastrar usuário.');
            }
        }
    };


    const converterParaNumero = (textoNumerico:String, funcaoSet:any) => {
        const onlyNumbers = Number(textoNumerico.replace(/[^0-9]/g, ''));

        funcaoSet(onlyNumbers);
    }

    const dataDiabetes = [
        { key: '1', value: 'Tipo 1' },
        { key: '2', value: 'Tipo 2' },
        { key: '3', value: 'Gestacional' },
        { key: '4', value: 'Pré-diabetes' },
        { key: '5', value: 'Outro' }
    ];

    const dataGenero = [
        { key: "1" , value: "Feminino" },
        { key: "2" , value: "Masculino" },
        { key: "3" , value: "Outros" },
        { key: "4" , value: "Prefiro não informar" }
    ]

    return (
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.titulo}>Meu Perfil</Text>
            
            <View style={styles.container1}>
                <Text style={styles.label}>📝 Nome</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                />
                <Text style={styles.label}>🎂 Idade</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Idade"
                    keyboardType="numeric"
                    value={String(idade)}
                    onChangeText={(idadeDigitada) => {
                        converterParaNumero(idadeDigitada, setIdade);
                    }}
                />
                <Text style={styles.label}>⚧️ Gênero</Text>
                <SelectList
                    setSelected={setSexo}
                    data={dataGenero}
                    save='value'
                    placeholder="Gênero"
                    boxStyles={styles.input}
                    inputStyles={styles.selectListInput}
                    dropdownStyles={{ borderWidth: 0 }}
                    dropdownTextStyles={styles.selectListDropdown}
                    search={false}
                />
                <Text style={styles.label}>📏 Altura (cm)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Altura (cm)"
                    keyboardType="numeric"
                    value={String(altura)}
                    onChangeText={(alturaDigitada) => {
                        converterParaNumero(alturaDigitada, setAltura)
                    }}
                />
                <Text style={styles.label}>⚖️ Peso (kg)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Peso (kg)"
                    keyboardType="numeric"
                    value={String(peso)}
                    onChangeText={(pesoDigitada) => {
                        converterParaNumero(pesoDigitada, setPeso)
                    }}
                />
                <Text style={styles.label}>🩺 Tipo de Diabetes</Text>
                <SelectList
                    setSelected={setTipoDiabetes}
                    data={dataDiabetes}
                    save="value"
                    placeholder="Tipo de Diabetes"
                    boxStyles={styles.input}
                    inputStyles={styles.selectListInput}
                    dropdownStyles={{ borderWidth: 0 }}
                    dropdownTextStyles={styles.selectListDropdown}
                    search={false}
                />
                <Text style={styles.label}>🎯 Meta de Glicemia</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Meta de Glicemia"
                    value={String(metaGlicemia)}
                    onChangeText={(metaGlicemiaDigitada) => {
                        converterParaNumero(metaGlicemiaDigitada, setMetaGlicemia)
                    }}
                />
                <TouchableOpacity style={styles.botao} onPress={salvarPerfil}>
                    <Text style={styles.textoBotao}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
    );
}
