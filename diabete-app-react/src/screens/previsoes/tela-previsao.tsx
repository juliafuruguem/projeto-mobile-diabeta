import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { styles } from '../previsoes/styles';
import { host } from '@/src/services/host';

export const TelaPrevisoes = () => {
  const [registros, setRegistros] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
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
  }, []);

  const glicemias = registros.filter(r => !r.tipoRefeicao && r.valor);
  const refeicoes = registros.filter(r => r.tipoRefeicao);

  function media(arr: number[]) {
    if (arr.length === 0) return "0.0";
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

  const mediaRefeicoes = media(refeicoes.map(r => r.mediaGlicemia ?? r.glicemiaAposRefeicao ?? 0));

  const refeicoesSemanaAtual = refeicoes.filter(r => new Date(r.dataHora) > new Date(now.getTime() - umaSemanaMs));
  const carboidratosSemanaAtual = refeicoesSemanaAtual.map(r => r.totalCarboidratos ?? 0);
  const mediaCarboidratosSemana = media(carboidratosSemanaAtual);

  function gerarSugestoes() {
    const sugestoes: { texto: string; cor: any; icone: string }[] = [];

    if (parseFloat(mediaAtual) > 140) {
      sugestoes.push({
        texto: "Sua média semanal está alta. Tente ajustar sua alimentação e atividade física.",
        cor: styles.dicaVermelha,
        icone: "⚠️"
      });
    } else if (parseFloat(mediaAtual) < 70) {
      sugestoes.push({
        texto: "Média semanal baixa. Atenção ao risco de hipoglicemia.",
        cor: styles.dicaVermelha,
        icone: "🚨"
      });
    }

    if (parseFloat(mediaRefeicoes) > 160) {
      sugestoes.push({
        texto: "Após as refeições, seus níveis estão altos. Reduza açúcares e carboidratos simples.",
        cor: styles.dicaAmarela,
        icone: "🍽️"
      });
    }

    if (semanaAtual.length < 7) {
      sugestoes.push({
        texto: "Poucas medições esta semana. Tente monitorar com mais frequência.",
        cor: styles.dicaAmarela,
        icone: "📉"
      });
    }

    sugestoes.push({
      texto: "Mantenha-se hidratado durante todo o dia.",
      cor: styles.dicaVerde,
      icone: "💧"
    });

    const cafeManha = refeicoes.filter(r => r.tipoRefeicao === 'cafe');
    if (cafeManha.length < 3) {
      sugestoes.push({
        texto: "Evite pular o café da manhã para manter a glicemia mais estável.",
        cor: styles.dicaBege,
        icone: "☕"
      });
    }

    return sugestoes;
  }

  const sugestoes = gerarSugestoes();

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
            style={{ flex: 1 }} 
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
        >
          <Text style={styles.titulo}>🔔 Alertas e Dicas</Text>
          <Text style={styles.subtituloDescricao}>
            Aqui você encontra alertas automáticos e dicas personalizadas para o seu controle de saúde!
          </Text>

          {carregando && <ActivityIndicator size="large" color="#1C3D73" style={{ marginVertical: 20 }} />}

          {!carregando && (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitulo}>Média Semanal</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <Text style={styles.cardValorPrincipal}>{mediaAtual} <Text style={{ fontSize: 18, fontWeight: '400' }}>mg/dL</Text></Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.cardTexto}>Hipos <Text style={{ fontWeight: 'bold' }}>{hipoAtual}</Text></Text>
                    <Text style={styles.cardTexto}>Hipers <Text style={{ fontWeight: 'bold' }}>{hiperAtual}</Text></Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardSecundario}>
                <Text style={styles.cardTitulo}>Refeições</Text>
                <Text style={styles.subtituloDescricao}>Média de carboidratos consumidos</Text>
                <Text style={styles.cardValorPrincipal}>
                  {mediaCarboidratosSemana} <Text style={{ fontSize: 18, fontWeight: '400' }}>g</Text>
                </Text>
              </View>

              <Text style={styles.dicasTitulo}>Dicas da Semana</Text>
              {sugestoes.map((s, i) => (
                <View key={i} style={[styles.dicaCard, s.cor]}>
                  <Text style={styles.dicaIcone}>{s.icone}</Text>
                  <Text style={styles.cardTexto}>{s.texto}</Text>
                </View>
              ))}
            </>
          )}
      </ScrollView>
    </SafeAreaView>
  );
};
