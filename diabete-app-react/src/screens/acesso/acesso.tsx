import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView, Image } from 'react-native';
import { styles } from '../acesso/styles'; 
import { useState } from 'react';
import { router } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { host } from '../../services/host';

export const Acesso = () => {
  const [nomeDigitado, setNomeDigitado] = useState('');
  const [userEncontrado, setUserEncontrado] = useState<string | null>(null);

  const salvarUserId = async (userId: string) => {
    try {
      await AsyncStorage.setItem('userId', userId);
      console.log("UserId salvo com sucesso.");
      router.navigate('/(stacks)/home');
    } catch (e) {
      console.error('Erro ao salvar o userId no AsyncStorage', e);
    }
  };

  const buscarUsuario = async () => {
    if (!nomeDigitado.trim()) {
      Alert.alert('Aviso', 'Por favor, digite seu nome.');
      return;
    }

    try {
      const response = await axios.get(`${host}:5000/api/users?nome=${encodeURIComponent(nomeDigitado)}`);

      const usuario = response.data;
      console.log(usuario);

      if (usuario) {
        setUserEncontrado(usuario.nome);
        salvarUserId(usuario._id);
      } else {
        setUserEncontrado(null);
        Alert.alert('Usuário não encontrado', 'Nome não cadastrado. Por favor, faça seu cadastro.');
      }
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      Alert.alert('Erro', 'Falha ao buscar usuário. Tente novamente.');
    }
  };

  return (
    <SafeAreaView style={styles.container1}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Image
          source={require("../../../assets/images/image.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titulo}>Cadastro concluído? Entre por aqui</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome"
          value={nomeDigitado}
          onChangeText={setNomeDigitado}
          autoCapitalize="words"
        />

        <TouchableOpacity style={styles.botao} onPress={buscarUsuario}>
          <Text style={styles.textoBotao}>Acessar</Text>
        </TouchableOpacity>

        <View style={styles.cadastroContainer}>
          <Text style={styles.subtitulo}>
            Primeiro acesso? Cadastre-se agora
          </Text>

          <TouchableOpacity style={[styles.botao, styles.botaoCadastrar]} onPress={() => router.navigate('/(stacks)/perfil-usuario')}>
          <Text style={styles.textoBotao}>Cadastrar</Text>
          </TouchableOpacity>

        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};
