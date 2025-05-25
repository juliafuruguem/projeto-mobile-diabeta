import React from "react";
import { TelaRegistro } from "@/src/screens/registro/tela-registro";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { router, useRouter } from "expo-router";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TelaRegistroScreen () {
    return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#003366" />
        </TouchableOpacity>
      </View>

        <View style={styles.content}>
            <TelaRegistro/>
        </View>
    </View>
    )  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F6FA",
  },
    header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F3F6FA",
    marginTop: 30
  },
    backButton: {
    marginRight: 10,
  },
    content: {
    flex: 1,
  },
});