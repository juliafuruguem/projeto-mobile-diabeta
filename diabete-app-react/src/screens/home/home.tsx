import { Alert, Image, Text, TouchableOpacity, View, Animated, ScrollView, SafeAreaView } from "react-native";
import { styles } from "../home/styles";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { host } from '../../services/host';
import { FlatList } from 'react-native';
import Toast, { BaseToast, BaseToastProps, ErrorToast, SuccessToast } from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export const Home = () => {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [registros, setRegistros] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      console.log('Tela focada!');
      
        const carregarRegistros = async () => {
          setCarregando(true);
          try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) return;
            const url = `${host}:5000/api/historico/${userId}?tipo=todos`;
            const response = await axios.get(url);
            setRegistros(response.data || []);
          } catch (error) {
            setRegistros([]);
          } finally {
            setCarregando(false);
          }
        };
        
        carregarRegistros();

      return () => {
        console.log('Tela desfocada!');
      };
    }, [])
  );

  const glicemias = registros.filter(r => !r.tipoRefeicao && r.valor);
  const refeicoes = registros.filter(r => r.tipoRefeicao);

  function media(arr: number[]) {
    if (!arr.length) return 0;
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  }

  const now = new Date();
  const umaSemanaMs = 7 * 24 * 60 * 60 * 1000;
  const semanaAtual = glicemias.filter(g => new Date(g.dataHora) > new Date(now.getTime() - umaSemanaMs));
  const semanaAnterior = glicemias.filter(g => {
    const d = new Date(g.dataHora);
    return d <= new Date(now.getTime() - umaSemanaMs) && d > new Date(now.getTime() - 2 * umaSemanaMs);
  });

  const mediaAtual = media(semanaAtual.map(g => g.valor));
  const mediaAnt = media(semanaAnterior.map(g => g.valor));
  const hipoAtual = semanaAtual.filter(g => g.valor < 70).length;
  const hiperAtual = semanaAtual.filter(g => g.valor > 180).length;

  const horarios = { manhã: [], tarde: [], noite: [] } as { [key: string]: number[] };
  glicemias.forEach(g => {
    const h = new Date(g.dataHora).getHours();
    if (h < 12) horarios.manhã.push(g.valor);
    else if (h < 18) horarios.tarde.push(g.valor);
    else horarios.noite.push(g.valor);
  });
  function tendencia(arr: number[]) {
    if (!arr.length) return '-';
    const m = Number(media(arr));
    if (m < 70) return 'Baixa';
    if (m > 140) return 'Alta';
    return 'Estável';
  }

  const toastConfig = {
    success: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#FFE014', height: 'auto' }}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: '#FFFCEC'
        }}
        text1Style={{
          fontSize: 18,
          fontWeight: 'bold',
        }}
        text2Style={{
          fontSize: 16,
          fontWeight: '400',
          flexWrap: 'wrap',
          color: 'black'
        }}
        text2NumberOfLines={4}
      />
    ),
  };
  
  const infoCards = [
    {
      id: '1',
      image: require('../../../assets/images/salada.png'),
      frase: 'Controle a diabetes com uma alimentação saudável e monitoramento regular da glicemia.',
      color: 'rgb(206, 244, 209)',
    },
    {
      id: '2',
      image: require('../../../assets/images/exercicio.png'),
      frase: 'Exercícios físicos ajudam a manter o açúcar no sangue sob controle.',
      color: '#E1D7F7',
    },
    {
      id: '3',
      image: require('../../../assets/images/agua.png'),
      frase: 'Beber bastante água auxilia no bom funcionamento do organismo e no controle da glicose.',
      color: '#D0F4FF',
    },
    {
      id: '4',
      image: require('../../../assets/images/maca.png'),
      frase: 'Evite o consumo excessivo de açúcar e prefira alimentos naturais no dia a dia.',
      color: 'rgb(246, 230, 183)',
    },
  ];

  const renderCard = ({ item }: { item: any }) => (
    <View style={[styles.carouselCard, { backgroundColor: item.color }]}>
      <View style={styles.iconeContainer1}>
        <Image source={item.image} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.carouselFrase}>{item.frase}</Text>
    </View>
  );

  const buscarUsuario = async () => {
    let userId = await AsyncStorage.getItem('userId');
    const response = await axios.get(`${host}:5000/api/users/${userId}`);
    setNomeUsuario(response.data.nome);
  };


  const dispararAlerta = () => {
    Toast.show({
      type: 'success', // ou 'error', 'info', 'success'
      text1: 'Alerta importante',
      text2: 'Você está sentado(a) a muito tempo, que tal levantar um pouco, tomar uma água e medir a glicemia ? 😉',
      position: 'top',
      autoHide: false
    });
  };


  function isMoreThan10Minutes(dataRegistro:any) {
    const { dia, mes, ano, horas, minutos } = dataRegistro;

    const dataSentou : any = new Date(
      `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}T${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}:00`
    );

    const agora : any = new Date();
    const diffEmMs = agora - dataSentou;
    const diffEmMinutos = diffEmMs / (1000 * 60);

    return diffEmMinutos >= 1;
  }
  
  const ultimaNotificacao = useRef<Date | null>(null); 
  function useMonitoramento(usuario:string) {

      setInterval(async () => {
        console.log("rodando")
        try {
          const response = await axios.get(`${host}:5000/cadeiraIOT?usuario=${usuario}`);
          const { dataRegistro, sentou } = response.data;

          const agora = new Date();
          const podeNotificar = !ultimaNotificacao.current || (agora.getTime() - ultimaNotificacao.current.getTime()) >= 1 * 60 * 1000; // 5 minutos em ms

          if (sentou === "true" && isMoreThan10Minutes(dataRegistro) && podeNotificar) {
            dispararAlerta(); 

            ultimaNotificacao.current = agora;
          }
        } catch (error) {
          //console.error('Erro ao buscar status do usuário:', error);
        }
      }, 10000); 
  }

  useEffect(() => { 
    buscarUsuario();

    useMonitoramento(nomeUsuario);
  }, [nomeUsuario]);

  const leituraRecente = glicemias.length > 0
  ? [...glicemias].sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())[0]
  : null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
        >
          <Text style={styles.boasVindas}>Olá, {nomeUsuario}!</Text>

          {leituraRecente && (
              <View style={styles.cardSecundario}>
                <Text style={styles.cardTitulo}>Leitura Recente</Text>
                <Text style={[styles.cardTexto, {marginBottom: 6}]}>{new Date(leituraRecente.dataHora).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} — {new Date(leituraRecente.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
                <Text style={styles.cardValorPrincipal}>{leituraRecente.valor} mg/dL</Text>
              </View>
            )}
            
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
              <FlatList
                data={infoCards}
                renderItem={renderCard}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 10 }}
                snapToAlignment="start"
                decelerationRate="fast"
                snapToInterval={320}
              />
            </View>

            <View style={styles.gridAcoes}>
              <TouchableOpacity style={[styles.cardBotao, { backgroundColor: '#ffffff' }]} onPress={() => router.navigate('/(stacks)/tela-registro')}>
                <View style={[styles.iconeContainer, {backgroundColor: '#D1F5FC' }]}>
                <Image
                    source={require("../../../assets/images/glic.png")}
                    style={styles.logoCard}
                />
                </View>
                <Text style={styles.textoCard}>Registrar Glicemia</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.cardBotao, { backgroundColor: '#ffffff' }]} onPress={() => router.navigate('/(stacks)/tela-refeicao')}>
                <View style={[styles.iconeContainer, {backgroundColor: '#FFF0F4' }]}>
                <Image
                    source={require("../../../assets/images/refeicao.png")}
                    style={styles.logoCard}
                />
                </View>
                <Text style={styles.textoCard}>Refeições</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.cardBotao, { backgroundColor: '#ffffff' }]} onPress={() => router.navigate('/(stacks)/historico')}>
                <View style={[styles.iconeContainer, {backgroundColor: '#F2F1E4' }]}>
                <Image
                    source={require("../../../assets/images/his.png")}
                    style={styles.logoCard}
                /> 
                </View>         
                <Text style={styles.textoCard}>Histórico</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.cardBotao, { backgroundColor: '#ffffff' }]} onPress={() => router.navigate('/(stacks)/relatorio')}>
                <View style={[styles.iconeContainer, {backgroundColor: '#E3FEE6' }]}>
                <Image
                    source={require("../../../assets/images/re.png")}
                    style={styles.logoCard}
                />    
                </View>    
                <Text style={styles.textoCard}>Exportar Relatório</Text>
              </TouchableOpacity>
            </View>
    </ScrollView>
    <Toast config={toastConfig} />
    </SafeAreaView>
  );
};
