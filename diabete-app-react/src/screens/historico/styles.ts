import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container1: {
      flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", 
  },
  filtrosContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  botaoFiltro: {
    backgroundColor: "#D0E8F2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: '30%', 
  },
  textoBotaoFiltro: {
    fontSize: 16,
    color: "#333",
    textAlign: "center", 
  },
  erro: {
    color: "#999",
    marginBottom: 10,
    textAlign: "center", 
    fontSize: 16,
  },
  itemRegistro: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000", 
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, 
  },
  tipo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  valor: {
    fontSize: 16,
    marginVertical: 5,
    color: "#666",
    margin: 0,
    marginTop: 3,
    marginBottom: 3
  },
  data: {
    fontSize: 14,
    color: "#999",
    marginTop: 3
  },
  carregandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  carregandoTexto: {
    fontSize: 16,
    color: '#1C3D73',
    fontWeight: '500',
  },
});
