import { TelaRefeicoes } from "@/src/screens/refeicoes/tela-refeicao";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function TelaRefeicoesScreen () {
    return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#003366" />
        </TouchableOpacity>
      </View>

        <View style={styles.content}>
            <TelaRefeicoes/>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
    header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F0F4F8",
    marginTop: 30
  },
    backButton: {
    marginRight: 10,
  },
    content: {
    flex: 1,
  },
});