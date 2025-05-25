import { styles } from "./styles";
import { Image, Text, TouchableOpacity, View, ActivityIndicator, Modal, SafeAreaView } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

export const TelaInicial = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleComecarPress = () => {
    setIsLoading(true);
    setTimeout(() => {
      router.navigate("/(stacks)/acesso");
      setIsLoading(false);
    }, 0);
  };

  return (
    <SafeAreaView style={styles.container1}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.descricao}>
            Seu controle de diabetes começa aqui. Simples, inteligente e eficaz.
          </Text>

          <TouchableOpacity style={styles.botao} onPress={handleComecarPress}>
            <Text style={styles.textoBotao}>Começar</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={isLoading} transparent animationType="fade">
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.titulo}>Bem-vindo(a)</Text> 
            <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
            />
            <Text style={styles.loadingText}>Aguarde um momento...</Text>

          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};
