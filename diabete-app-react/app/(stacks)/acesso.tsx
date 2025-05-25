import { Acesso } from "@/src/screens/acesso/acesso";
import { router, useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function AcessoUsuario() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#003366" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Acesso />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
    header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    marginTop: 30
  },
    backButton: {
    marginRight: 10,
  },
    content: {
    flex: 1,
  },
});