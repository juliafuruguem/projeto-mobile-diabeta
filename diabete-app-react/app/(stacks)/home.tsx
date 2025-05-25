import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Home } from "@/src/screens/home/home";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export const screenOptions = {
  headerShown: false, 
};

export default function HomeScreen() {
  const router = useRouter();

  return (
  
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#003366" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Home />
      </View>

      <View style={styles.footer}>
        <FooterButton
          icon={require("../../assets/images/alerta.png")}
          label="Alertas"
          onPress={() => router.navigate('/(stacks)/tela-previsao')}
        />
        <FooterButton
          icon={require("../../assets/images/gota.png")}
          label="Glicemia"
          onPress={() => router.navigate('/(stacks)/tela-registro')}
        />
        <FooterButton
          icon={require("../../assets/images/documento.png")}
          label="Histórico"
          onPress={() => router.navigate('/(stacks)/historico')}
        />
        <FooterButton
          icon={require("../../assets/images/usuario.png")}
          label="Meu perfil"
          onPress={() => router.navigate('/(stacks)/editar-usuario')}
        />
      </View>
    </View>
    
  );
}

function FooterButton({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 20,
    backgroundColor: "#F7F7F7",
    marginTop: 30
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgb(255, 255, 255)",
    paddingVertical: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  button: {
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: "rgb(0, 0, 0)",
  },
});
